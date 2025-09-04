import React, { Suspense, useCallback } from 'react';
import { Box, LoadingButton, Inline, Text, Spinner, SectionMessage, Stack } from '@forge/react';
import { GetPullRequestPayload } from '../../../types';
import { PullRequest } from '../shared/PullRequest';
import { Issue } from '../issue/Issue';
import { useMerge } from '../../hooks/useMerge';
import { ConfirmModal } from '../shared/ConfirmModal';

type Props = {
    payload: GetPullRequestPayload;
};

export const PullRequestList: React.FC<Props> = ({ payload }) => {
    const {
        showSpinner,
        data,
        mergeInProgress,
        showSuccessMessage,
        isModalOpen,
        setModalOpen,
        onMerge,
    } = useMerge(payload);

    const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
    const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

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
                        <Stack space='space.200'>
                            <PullRequest pr={pr} />
                            <LoadingButton
                                shouldFitContainer
                                isLoading={mergeInProgress || pr.locked}
                                onClick={openModal}
                                appearance='primary'
                            >
                                Merge
                            </LoadingButton>
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
            )) : null}
            {!showSpinner && !data?.length ? <Text>No Pull Requests</Text> : null}
            {showSuccessMessage && <SectionMessage appearance='success'>PR has been merged</SectionMessage>}
        </Suspense>
    );
};