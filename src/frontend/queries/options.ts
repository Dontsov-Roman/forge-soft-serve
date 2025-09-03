import { invoke } from '@forge/bridge';
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { GitPullRequest, GitRepository, MergePullRequestPayload } from '../../types';
import { GET_PULL_REQUESTS_DEF, GET_REPOSITORIES_DEF, MERGE_PULL_REQUESTS_DEF } from '../../constants';
import { GET_PULL_REQUESTS_KEY, GET_REPOSITORIES_KEY, MERGE_PULL_REQUESTS_KEY } from './keys';
import { GetPullRequestPayload } from '../../types';

const staleTime = 5000;
export const getRepositoriesOption = () => queryOptions({
    queryKey: [GET_REPOSITORIES_KEY],
    queryFn: () => invoke<GitRepository[]>(GET_REPOSITORIES_DEF),
    staleTime,
});

export const getPullRequestsOption = (payload: GetPullRequestPayload) => queryOptions({
    queryKey: [GET_PULL_REQUESTS_KEY, payload.owner, payload.repo],
    queryFn: () => invoke<GitPullRequest[]>(GET_PULL_REQUESTS_DEF, payload),
    staleTime,
});

export const mergePullRequestMutation = (payload: MergePullRequestPayload) => mutationOptions({
    mutationKey: [MERGE_PULL_REQUESTS_KEY],
    mutationFn: () => invoke(MERGE_PULL_REQUESTS_DEF, payload),
});