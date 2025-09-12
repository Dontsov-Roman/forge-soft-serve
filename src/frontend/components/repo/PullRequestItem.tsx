import React, { useCallback } from 'react';
import { Box, Inline, Stack } from '@forge/react';
import { GitPullRequest } from '../../../types';
import { PullRequest } from '../shared/PullRequest';
import { Issue } from '../issue/Issue';
import { PullRequestActions } from '../shared/PullRequestActions';
import { useModal } from '../../hooks/useModal';

type Props = {
    pr: GitPullRequest;
    onMerge: (pr: GitPullRequest) => void;
    onApprove: (pr: GitPullRequest) => void;
    isApproveLoading: boolean;
    isMergeLoading: boolean;
};

export const PullRequestItem: React.FC<Props> = ({ isApproveLoading, isMergeLoading, pr, onApprove, onMerge }) => {
    const { showModal } = useModal();

    const approveClick = useCallback(() => onApprove(pr), [onApprove, pr]);

    const mergeClick = useCallback(() => showModal({
        title: `Do you want to merge it?`,
        body: `PR #${pr.number} will be merged to ${pr.base.ref}`,
        onConfirm: () => onMerge(pr),
    }), [pr, showModal]);

    return (
        <Box
            padding="space.200"
            backgroundColor='color.background.information'
        >
            <Inline
                key={pr.id}
                spread='space-between'
            >
                <Box padding="space.200">
                    <Stack space='space.200'>
                        <PullRequest pr={pr} />
                        <PullRequestActions
                            isApproveLoading={isApproveLoading}
                            isMergeLoading={isMergeLoading || pr.locked}
                            onApprove={approveClick}
                            onMerge={mergeClick}
                        />
                    </Stack>
                </Box>
                <Issue title={pr.title} />
            </Inline>
        </Box>
    );
}
