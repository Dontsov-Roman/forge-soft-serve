import React, { Suspense, useCallback } from 'react';
import { Box, LoadingButton, Inline, Text } from '@forge/react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getIssueOption, getPullRequestsOption, mergePullRequestMutation, moveIssueToDoneMutation } from '../../queries/options';
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
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: [GET_ISSUE_KEY, id] });
        },
    });
    
    const { mutate: mergePr, isPending: mergeInProgress } = useMutation({
        ...mergePullRequestMutation(),
        onSuccess: (data, payload) => {
            closeIssue(getIssueKey(payload.title));
            queryClient.invalidateQueries({ queryKey: [GET_PULL_REQUESTS_KEY] });
        },
    });

    const onMerge = useCallback(async (pr: GitPullRequest) => {
        mergePr({ repo: pr.base.repo.name, owner: pr.base.repo.owner.login, pull_number: pr.number, title: pr.title });
    }, [mergePr, closeIssue]);

    return (
        <Suspense fallback="Loading Pull Requests">
            {data?.length ? data.map((pr) => (
                <Inline space='space.1000' key={pr.id}>
                    <Box backgroundColor='color.background.information'>
                        <Text>{pr.id}</Text>
                        <PullRequest pr={pr} />
                        <LoadingButton
                            isLoading={mergeInProgress || pr.locked}
                            onClick={() => onMerge(pr)}
                            appearance='primary'
                        >Merge</LoadingButton>
                    </Box>
                    <Issue title={pr.title} />
                </Inline>
            )) : <Text>No Pull Requests</Text>}
        </Suspense>
    );
};