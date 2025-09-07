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
        return this.requestStrategy.getIssue(id, this.getMethod);
    }

    async getTransitions(id: string): Promise<IssueTransition[]> {
        return this.requestStrategy.getTransitions(id, this.getMethod);
    }

    async changeIssueStatus(id: string | number, transitionId: string | number) {
        const props = this.preparePostMethod({ transition: { id: transitionId } });
        return this.requestStrategy.changeIssueStatus(id, props);
    }
    async moveToDone(id: string) {
        const transitions = await this.getTransitions(id);
        const doneTransition = transitions?.find((t: any) => t?.name === this.DONE && t.isAvailable);
        console.log('=============================');
        console.log(transitions);
        console.log(doneTransition);
        if (doneTransition) {
            return this.changeIssueStatus(id, doneTransition.id);
            // const props = this.preparePostMethod({ transition: { id: doneTransition.id } });
            // return this.requestStrategy.changeIssueStatus(id, props);
        }
        return false;
    }
}