import { invoke } from '@forge/bridge';
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { Issue } from '../../../types';
import {
    CHANGE_ISSUE_STATUS_DEF,
    GET_ISSUE_DEF,
    GET_ISSUE_TRANSITIONS_DEF,
    MOVE_ISSUE_TO_DONE_DEF,
} from '../../../constants';
import {
    CHANGE_ISSUE_STATUS_KEY,
    GET_ISSUE_KEY,
    GET_ISSUE_TRANSITION_KEY,
    MOVE_ISSUE_TO_DONE_KEY,
} from '../../keys';
import { Services } from '../../../services/Services';
import { FrontJiraRequesterStrategy } from '../../../services/FrontJiraRequesterStrategy';
import { IssueTransition } from '../../../types/IssueTransition';

const staleTime = 5000;

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