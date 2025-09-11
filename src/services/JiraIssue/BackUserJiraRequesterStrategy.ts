import { route, asUser } from '@forge/api';
import { IIssueRequesterStrategy, Headers } from './types';
import { Issue, IssueTransition } from '../../types';

export class BackUserJiraRequesterStrategy implements IIssueRequesterStrategy {
    async getIssue(key: string, headers?: Headers): Promise<Issue> {
        const res = await asUser().requestJira(route`/rest/api/3/issue/${key}`, headers);
        return res.json();
    }
    async getTransitions(key: string, headers?: Headers): Promise<IssueTransition[]> {
        const response = await asUser().requestJira(route`/rest/api/3/issue/${key}/transitions`, headers);
        const result = await response.json();
        return result.transitions;
    }
    async changeIssueStatus(key: string | number, headers?: Headers) {
        const result = await asUser().requestJira(route`/rest/api/3/issue/${key}/transitions`, headers);
        return result.ok;
    }
}