import { Issue } from "../types";
import { IssueTransition } from "../types/IssueTransition";
import { IIssueRequesterStrategy } from "./types";

export class JiraIssuesService {
    private DONE = 'Done';
    private requestStrategy: IIssueRequesterStrategy;

    constructor(
        strategy: IIssueRequesterStrategy,
    ) {
        this.requestStrategy = strategy;
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
        const issue = await this.requestStrategy.getIssue(id, this.getMethod);
        return issue;
    }

    async getTransitions(id: string): Promise<IssueTransition[]> {
        return this.requestStrategy.getTransitions(id, this.getMethod);
    }

    async moveToDone(id: string) {
        const transitions = await this.getTransitions(id);
        const doneTransition = transitions.find((t: any) => t?.name === this.DONE && t.isAvailable);
        if (doneTransition) {
            const props = this.preparePostMethod({ transition: { id: doneTransition.id } });
            return this.requestStrategy.moveToDone(id, props);
        }
    }
}