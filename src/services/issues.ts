import type { RequestProductMethod } from '@forge/api'
import { Issue } from "../types";
import { IssueTransition } from "../types/IssueTransition";
import { IRequester } from "./types";

export type JiraRequest =
    ((restPath: string, fetchOptions?: RequestInit) => Promise<Response>) |
    ((url: any, init?: RequestInit) => Promise<Response>) | 
    RequestProductMethod;

export class IssueService {
    private url = '/rest/api/3/issue';
    private DONE = 'Done';
    private requester: IRequester;

    constructor(
        routeBuilder: IRequester,
    ) {
        this.requester = routeBuilder;
    }

    private get headers() {
        return {
            'Accept': 'application/json',
        }
    }
    private get getMethod() {
        return {
            method: 'GET',
            headers: this.headers,
        }
    }
    
    private preparePostMethod(body: any) {
        return {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
    }

    async getIssue(id: string): Promise<Issue> {
        const issue = await this.requester.request<Issue>(`${this.url}/${id}`, this.getMethod);
        console.log(issue);
        return issue;
    }

    async getTransitions(id: string): Promise<IssueTransition[]> {
        const response = await this.requester.request<{ transitions: IssueTransition[] }>(`${this.url}/${id}/transitions`, this.getMethod);
        const { transitions } = response;
        return transitions;
    }

    async moveToDone(id: string) {
        const transitions = await this.getTransitions(id);
        const doneTransition = transitions.find((t: any) => t?.name === this.DONE && t.isAvailable);
        if (doneTransition) {
            const props = this.preparePostMethod({ transition: { id: doneTransition.id } });
            return this.requester.request(`${this.url}/${id}/transitions`, props);
        }
    }
}