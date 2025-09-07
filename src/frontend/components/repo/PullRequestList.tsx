import React, { Suspense, useCallback } from 'react';
import { Box, LoadingButton, Inline, Spinner, Stack, Button, EmptyState, ButtonGroup, replaceUnsupportedDocumentNodes } from '@forge/react';
import { GetPullRequestPayload } from '../../../types';
import { PullRequest } from '../shared/PullRequest';
import { Issue } from '../issue/Issue';
import { useGit } from '../../hooks/useGit';
import { ConfirmModal } from '../shared/ConfirmModal';

type Props = {
    payload: GetPullRequestPayload;
};

export const PullRequestList: React.FC<Props> = React.memo(({ payload }) => {
    const {
        showSpinner,
        data,
        mergeInProgress,
        isModalOpen,
        isAprrovePending,
        setModalOpen,
        onMerge,
        onApprove,
    } = useGit(payload);

    const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
    const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

    return (
        <Suspense fallback={<Spinner size="large" />}>
            {showSpinner && <Spinner size="large" />}
            {data?.length ? data?.map((pr) => (
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
                                <ButtonGroup>
                                    <Button
                                        isDisabled={isAprrovePending}
                                        appearance='default'
                                        iconBefore="check-circle-outline"
                                        onClick={() => onApprove(pr)}
                                    >
                                        Approve
                                    </Button>
                                    <LoadingButton
                                        isLoading={mergeInProgress || pr.locked}
                                        onClick={openModal}
                                        appearance='primary'
                                    >
                                        Merge
                                    </LoadingButton>
                                </ButtonGroup>
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