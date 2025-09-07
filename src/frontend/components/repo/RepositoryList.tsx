import React, { Suspense, useEffect } from 'react';
import { EmptyState, Spinner, Stack } from '@forge/react';
import { useQuery } from '@tanstack/react-query';
import { RepoItem } from '../shared/RepoItem';
import { getRepositoriesOption } from '../../queries/options';
import { PullRequestList } from './PullRequestList';
import { useMessage } from '../../hooks';

export const RepositoryList: React.FC = React.memo(() => {
    const { showMessage } = useMessage();
    const { data, isLoading, error } = useQuery(getRepositoriesOption());
    useEffect(() => {
        if(error?.message)
            showMessage({ message: error?.message, appearance: 'error' });
    }, [error]);
    
    return (
        <Suspense fallback={<Spinner size='xlarge' />}>
            {isLoading || !data?.map ?
                <Spinner size='xlarge' /> :
                data?.map((repo) => (
                    <Stack key={repo.id}>
                        <RepoItem repo={repo} />
                        <PullRequestList payload={{ owner: repo.owner.login, repo: repo.name }} />
                    </Stack>
                ))}
            {!isLoading && data?.length === 0 && <EmptyState header='No Repositories' />} 
        </Suspense>
    )
});