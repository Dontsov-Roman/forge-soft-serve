import type { RequestProductMethod } from '@forge/api'
import { Issue } from "../types";
import { IssueTransition } from "../types/IssueTransition";
import { IRouteBuilder } from "./types";

export type JiraRequest =
    ((restPath: string, fetchOptions?: RequestInit) => Promise<Response>) |
    ((url: any, init?: RequestInit) => Promise<Response>) | 
    RequestProductMethod;

export class IssueService {
    private url = '/rest/api/3/issue';
    private DONE = 'Done';
    private request: JiraRequest;
    private routeBuilder: IRouteBuilder;

    constructor(
        request: JiraRequest,
        routeBuilder: IRouteBuilder,
    ) {
        this.request = request;
        this.routeBuilder = routeBuilder;
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

    private buildRoute(r: string): any {
        return this.routeBuilder.buildRoute(r);
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
        const response = await this.request(this.buildRoute(`${this.url}/${id}`), this.getMethod);
        const issue = await response.json();
        console.log(issue);
        return issue;
    }

    async getTransitions(id: string): Promise<IssueTransition[]> {
        const response = await this.request(this.buildRoute(`${this.url}/${id}/transitions`), this.getMethod);
        const { transitions } = await response.json();
        return transitions;
    }

    async moveToDone(id: string) {
        const transitions = await this.getTransitions(id);
        const doneTransition = transitions.find((t: any) => t?.name === this.DONE && t.isAvailable);
        if (doneTransition) {
            const props = this.preparePostMethod({ transition: { id: doneTransition.id } });
            const response = await this.request(this.buildRoute(`${this.url}/${id}/transitions`), props);
            const result = await response.json();
            return result;
        }
    }
}