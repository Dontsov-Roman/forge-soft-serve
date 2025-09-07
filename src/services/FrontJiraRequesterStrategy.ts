import { requestJira } from "@forge/bridge";
import { IIssueRequesterStrategy, Headers } from "./types";
import { Issue } from "../types";
import { IssueTransition } from "../types/IssueTransition";

export class FrontJiraRequesterStrategy implements IIssueRequesterStrategy {
    private url = '/rest/api/3/issue';
    async getIssue(key: string, headers?: Headers): Promise<Issue> {
        const res = await requestJira(`${this.url}/${key}`, headers);
        return res.json();
    }
    async getTransitions(key: string, headers?: Headers): Promise<IssueTransition[]> {
        const response = await requestJira(`${this.url}/${key}/transitions`, headers);
        const { transitions } = await response.json();
        return transitions;
    }
    async changeIssueStatus(key: string | number, headers?: Headers) {
        const result = await requestJira(`${this.url}/${key}/transitions`, headers);
        return result.ok;
    }
}