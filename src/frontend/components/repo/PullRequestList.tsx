import React, { Suspense } from 'react';
import { Box, LoadingButton, Inline, Text, Spinner, SectionMessage } from '@forge/react';
import { GetPullRequestPayload } from '../../../types';
import { PullRequest } from '../shared/PullRequest';
import { Issue } from '../issue/Issue';
import { useMerge } from '../../hooks/useMerge';

type Props = {
    payload: GetPullRequestPayload;
};

export const PullRequestList: React.FC<Props> = ({ payload }) => {
    const { showSpinner, data, mergeInProgress, showSuccessMessage, onMerge } = useMerge(payload);

    return (
        <Suspense fallback={<Spinner size="large" />}>
            {showSpinner && <Spinner size="large" />}
            {data?.length ? data.map((pr) => (
                <Inline
                    key={pr.id}
                    spread='space-between'
                >
                    <Box
                        padding="space.200"
                        backgroundColor='color.background.information'
                    >
                        <PullRequest pr={pr} />
                        <LoadingButton
                            isLoading={mergeInProgress || pr.locked}
                            onClick={() => onMerge(pr)}
                            appearance='primary'
                        >Merge</LoadingButton>
                    </Box>
                    <Issue title={pr.title} />
                </Inline>
            )) : null}
            {!showSpinner && !data?.length ? <Text>No Pull Requests</Text> : null}
            {showSuccessMessage && <SectionMessage appearance='success'>PR has been merged</SectionMessage>}
        </Suspense>
    );
};