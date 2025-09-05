import { invoke } from '@forge/bridge';
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { AuthPayload, CreateReviewPullRequest, GitPullRequest, GitRepository, MergePullRequestPayload } from '../../types';
import {
    GET_PULL_REQUESTS_DEF,
    GET_REPOSITORIES_DEF,
    MERGE_PULL_REQUESTS_DEF,
    REVIEW_PULL_REQUESTS_DEF,
    SET_GIT_HUB_TOKEN_DEF,
} from '../../constants';
import {
    AUTH_KEY,
    GET_ISSUE_KEY,
    GET_ISSUE_TRANSITION_KEY,
    GET_PULL_REQUESTS_KEY,
    GET_REPOSITORIES_KEY,
    MERGE_PULL_REQUESTS_KEY,
    MOVE_ISSUE_TO_DONE_KEY,
    REVIEW_PULL_REQUESTS_KEY,
} from './keys';
import { GetPullRequestPayload } from '../../types';
import { IssueService } from '../../services/issues';

const issueService = new IssueService();
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

export const getIssueOption = (id: string) => queryOptions({
    queryKey: [GET_ISSUE_KEY, id],
    queryFn: () => issueService.getIssue(id),
    staleTime,
});

export const getIssueTransitionOption = (id: string) => queryOptions({
    queryKey: [GET_ISSUE_TRANSITION_KEY, id],
    queryFn: () => issueService.getTransitions(id),
    staleTime,
});

export const mergePullRequestMutation = () => mutationOptions({
    mutationKey: [MERGE_PULL_REQUESTS_KEY],
    mutationFn: (payload: MergePullRequestPayload) => invoke(MERGE_PULL_REQUESTS_DEF, payload),
});

export const reviewPullRequestMutation = () => mutationOptions({
    mutationKey: [REVIEW_PULL_REQUESTS_KEY],
    mutationFn: (payload: CreateReviewPullRequest) => invoke(REVIEW_PULL_REQUESTS_DEF, payload),
});

export const moveIssueToDoneMutation = () => mutationOptions({
    mutationKey: [MOVE_ISSUE_TO_DONE_KEY],
    mutationFn: (key: string) => issueService.moveToDone(key),
});

export const authMutation = () => mutationOptions({
    mutationKey: [AUTH_KEY],
    mutationFn: (payload: AuthPayload) => invoke(SET_GIT_HUB_TOKEN_DEF, payload),
})