import React, { Suspense } from 'react';

// Create a client
import { RepoItem } from '../shared/RepoItem';
import { useQuery } from '@tanstack/react-query';
import { getRepositoriesOption } from '../../queries/options';
import { PullRequestList } from './PullRequestList';

export const RepositoryList: React.FC = () => {
    const { data } = useQuery(getRepositoriesOption());
    
    return (
        <Suspense fallback="Loading...">
            {data?.map((repo) => (
                <>
                    <RepoItem key={repo.id} repo={repo} />
                    <PullRequestList payload={{ owner: repo.owner.login, repo: repo.name }} />
                </>
            ))}
        </Suspense>
    )
};