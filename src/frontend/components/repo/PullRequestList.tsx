import React, { Suspense } from 'react';
import { Spinner, EmptyState } from '@forge/react';
import { GetPullRequestPayload } from '../../../types';
import { useGit } from '../../hooks';
import { PullRequestItem } from './PullRequestItem';

type Props = {
    payload: GetPullRequestPayload;
};

export const PullRequestList: React.FC<Props> = React.memo(({ payload }) => {
    const {
        showSpinner,
        data,
        isMergeLoading,
        isApproveLoading,
        onMerge,
        onApprove,
    } = useGit(payload);

    return (
        <Suspense fallback={<Spinner size="large" />}>
            {showSpinner && <Spinner size="large" />}
            {!showSpinner && data?.length ? data?.map((pr) => (
                <PullRequestItem
                    key={pr.id}
                    pr={pr}
                    isApproveLoading={isApproveLoading}
                    isMergeLoading={isMergeLoading}
                    onApprove={onApprove}
                    onMerge={onMerge}
                />
            )) : null}
            {!showSpinner && !data?.length ? <EmptyState header='No Pull Requests' /> : null}
        </Suspense>
    );
}, (
    { payload: { owner: prevOwner, repo: prevRepo } },
    { payload: { owner, repo } }) => prevOwner === owner && prevRepo === repo);