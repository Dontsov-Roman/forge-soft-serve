import React, { Suspense, useCallback } from 'react';
import { Box, Button, Inline, Text } from '@forge/react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getIssueOption, getIssueTransitionOption, getPullRequestsOption, mergePullRequestMutation, moveIssueToDoneMutation } from '../../queries/options';
import { GetPullRequestPayload, GitPullRequest } from '../../../types';
import { PullRequest } from '../shared/PullRequest';
import { getIssueKey } from '../../utils/getIssueKey';
import { Issue } from '../issue/Issue';
import { GET_ISSUE_KEY, GET_PULL_REQUESTS_KEY } from '../../queries/keys';

type Props = {
    payload: GetPullRequestPayload;
};

export const PullRequestList: React.FC<Props> = ({ payload }) => {
    const queryClient = useQueryClient();
    const { data } = useQuery(getPullRequestsOption(payload));
    
    useQueries({
        queries: data?.map((pr) => getIssueOption(getIssueKey(pr.title))) || [],
    });

    const { mutate: closeIssue } = useMutation({
        ...moveIssueToDoneMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ISSUE_KEY] });
        },
    });
    
    const { mutate: mergePr, isPending: mergeInProgress } = useMutation({
        ...mergePullRequestMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PULL_REQUESTS_KEY] });
        },
    });

    const onMerge = useCallback(async (pr: GitPullRequest) => {
        mergePr({ repo: pr.repo.id, owner: pr.repo.owner.id, pull_number: pr.number });
    }, [mergePr]);

    return (
        <Suspense fallback="Loading Pull Requests">
            {data?.length ? data.map((pr) => (
                <Inline space='space.1000' key={pr.id}>
                    <Box backgroundColor='color.background.information'>
                        <PullRequest pr={pr} />
                        <Button
                            isDisabled={mergeInProgress || pr.locked}
                            onClick={() => onMerge(pr)}
                            appearance='primary'
                        >Merge</Button>
                    </Box>
                    <Issue title={pr.title} />
                </Inline>
            )) : <Text>No Pull Requests</Text>}
        </Suspense>
    );
};