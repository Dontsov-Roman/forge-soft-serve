import { route, asApp } from '@forge/api';
import { IIssueRequesterStrategy, Headers } from "./types";
import { Issue } from '../types';
import { IssueTransition } from '../types/IssueTransition';

export class BackJiraRequesterStrategy implements IIssueRequesterStrategy {
    async getIssue(key: string, headers?: Headers): Promise<Issue> {
        const res = await asApp().requestJira(route`/rest/api/3/issue/${key}`, headers);
        return res.json();
    }
    async getTransitions(id: string, headers?: Headers): Promise<IssueTransition[]> {
        const response = await asApp().requestJira(route`/rest/api/3/issue/${id}/transitions`, headers);
        const { transitions } = await response.json();
        return transitions;
    }
    async moveToDone(id: string, headers?: Headers) {
        const result = await asApp().requestJira(route`/rest/api/3/issue/${id}/transitions`, headers);
        return result.ok;
    }
}