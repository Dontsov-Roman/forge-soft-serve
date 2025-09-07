import { invoke } from '@forge/bridge';
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { AuthPayload, CreateReviewPullRequest, GitPullRequest, GitRepository, Issue, MergePullRequestPayload } from '../../types';
import {
    CHANGE_ISSUE_STATUS_DEF,
    GET_ISSUE_DEF,
    GET_ISSUE_TRANSITIONS_DEF,
    GET_PULL_REQUESTS_DEF,
    GET_REPOSITORIES_DEF,
    MERGE_PULL_REQUESTS_DEF,
    MOVE_ISSUE_TO_DONE_DEF,
    REVIEW_PULL_REQUESTS_DEF,
    SET_GIT_HUB_TOKEN_DEF,
} from '../../constants';
import {
    AUTH_KEY,
    CHANGE_ISSUE_STATUS_KEY,
    GET_ISSUE_KEY,
    GET_ISSUE_TRANSITION_KEY,
    GET_PULL_REQUESTS_KEY,
    GET_REPOSITORIES_KEY,
    MERGE_PULL_REQUESTS_KEY,
    MOVE_ISSUE_TO_DONE_KEY,
    REVIEW_PULL_REQUESTS_KEY,
} from './keys';
import { GetPullRequestPayload } from '../../types';
import { Services } from '../../services/Services';
import { FrontJiraRequesterStrategy } from '../../services/FrontJiraRequesterStrategy';
import { IssueTransition } from '../../types/IssueTransition';

const staleTime = 5000;

export const authMutation = () => mutationOptions({
    mutationKey: [AUTH_KEY],
    mutationFn: (payload: AuthPayload) => invoke(SET_GIT_HUB_TOKEN_DEF, payload),
});

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

export const mergePullRequestMutation = () => mutationOptions({
    mutationKey: [MERGE_PULL_REQUESTS_KEY],
    mutationFn: (payload: MergePullRequestPayload) => invoke(MERGE_PULL_REQUESTS_DEF, payload),
});

export const reviewPullRequestMutation = () => mutationOptions({
    mutationKey: [REVIEW_PULL_REQUESTS_KEY],
    mutationFn: (payload: CreateReviewPullRequest) => invoke(REVIEW_PULL_REQUESTS_DEF, payload),
});


export const getIssueOption = (key: string) => queryOptions<Issue>({
    queryKey: [GET_ISSUE_KEY, key],
    // queryFn: async () => {
    //     await Services.buildIssue(new FrontJiraRequesterStrategy());
    //     return (await Services.getIssueService()).getIssue(key)
    // },
    queryFn: async () => invoke(GET_ISSUE_DEF, { key }),
    staleTime,
});

export const getIssueTransitionOption = (key: string) => queryOptions<IssueTransition[]>({
    queryKey: [GET_ISSUE_TRANSITION_KEY, key],
    queryFn: async () => {
        await Services.buildIssue(new FrontJiraRequesterStrategy());
        return (await Services.getIssueService()).getTransitions(key)
    },
    // queryFn: async () => invoke(GET_ISSUE_TRANSITIONS_DEF, { key }),
    staleTime,
});

export const changeIssueStatusMutation = () => mutationOptions({
    mutationKey: [CHANGE_ISSUE_STATUS_KEY],
    mutationFn: async (payload: { key: string | number, status: string }) => {
        await Services.buildIssue(new FrontJiraRequesterStrategy());
        const issueService = await Services.getIssueService(); 
        await issueService.changeIssueStatus(payload.key, payload.status);
        return payload;
    },
    // mutationFn: async(payload: { key: string | number, status: string }) => {
    //     await invoke(CHANGE_ISSUE_STATUS_DEF, payload);
    //     return payload;
    // }
});

export const moveIssueToDoneMutation = () => mutationOptions({
    mutationKey: [MOVE_ISSUE_TO_DONE_KEY],
    mutationFn: async (key: string) => {
        await Services.buildIssue(new FrontJiraRequesterStrategy());
        const issueService = await Services.getIssueService(); 
        await issueService.moveToDone(key);
        return key;
    },
    // mutationFn: async (key: string) => {
    //     await invoke(MOVE_ISSUE_TO_DONE_DEF, { key });
    //     return key;
    // }
});