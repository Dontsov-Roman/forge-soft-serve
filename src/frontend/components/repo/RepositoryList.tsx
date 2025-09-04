import React, { Suspense } from 'react';
import { Spinner, Stack } from '@forge/react';
import { useQuery } from '@tanstack/react-query';
import { RepoItem } from '../shared/RepoItem';
import { getRepositoriesOption } from '../../queries/options';
import { PullRequestList } from './PullRequestList';

export const RepositoryList: React.FC = () => {
    const { data, isLoading } = useQuery(getRepositoriesOption());
    
    return (
        <Suspense fallback={<Spinner size='xlarge' />}>
            {isLoading ?
                <Spinner size='xlarge' /> :
                data?.map((repo) => (
                    <Stack>
                        <RepoItem key={repo.id} repo={repo} />
                        <PullRequestList payload={{ owner: repo.owner.login, repo: repo.name }} />
                    </Stack>
                ))}
        </Suspense>
    )
};