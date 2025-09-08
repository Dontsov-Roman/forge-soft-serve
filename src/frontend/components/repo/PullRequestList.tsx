import React, { Suspense, useCallback } from 'react';
import { Box, LoadingButton, Inline, Spinner, Stack, Button, EmptyState, ButtonGroup } from '@forge/react';
import { GetPullRequestPayload } from '../../../types';
import { PullRequest } from '../shared/PullRequest';
import { Issue } from '../issue/Issue';
import { useGit } from '../../hooks';
import { ConfirmModal } from '../shared/ConfirmModal';
import { PullRequestActions } from '../shared/PullRequestActions';

type Props = {
    payload: GetPullRequestPayload;
};

export const PullRequestList: React.FC<Props> = React.memo(({ payload }) => {
    const {
        showSpinner,
        data,
        mergeInProgress,
        isModalOpen,
        isAprroveLoading,
        setModalOpen,
        onMerge,
        onApprove,
    } = useGit(payload);

    const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
    const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

    return (
        <Suspense fallback={<Spinner size="large" />}>
            {showSpinner && <Spinner size="large" />}
            {!showSpinner && data?.length ? data?.map((pr) => (
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
                                    isApproveLoading={isAprroveLoading}
                                    isMergeLoading={mergeInProgress || pr.locked}
                                    onApprove={() => onApprove(pr)}
                                    onMerge={openModal}
                                />
                            </Stack>
                            <ConfirmModal
                                isOpen={isModalOpen}
                                onConfirm={() => {
                                    closeModal();
                                    onMerge(pr);
                                }}
                                onCancel={closeModal}
                            />
                        </Box>
                        <Issue title={pr.title} />
                    </Inline>
                </Box>
            )) : null}
            {!showSpinner && !data?.length ? <EmptyState header='No Pull Requests' /> : null}
        </Suspense>
    );
}, (
    { payload: { owner: prevOwner, repo: prevRepo } },
    { payload: { owner, repo } }) => prevOwner === owner && prevRepo === repo);