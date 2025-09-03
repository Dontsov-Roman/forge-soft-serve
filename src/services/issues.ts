import { requestJira } from "@forge/bridge"
import { Issue } from "../types";
import { IssueTransition } from "../types/IssueTransition";

export class IssueService {
    private url = '/rest/api/3/issue';
    private DONE = 'Done';
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
        const response = await requestJira(`${this.url}/${id}`, this.getMethod);
        return response.json();
    }

    async getTransitions(id: string): Promise<IssueTransition[]> {
        const response = await requestJira(`${this.url}/${id}/transitions`, this.getMethod);
        return response.json();
    }

    async moveToDone(id: string) {
        const transitions = await this.getTransitions(id);
        const doneTransition = transitions.find((t: any) => t?.name === this.DONE);
        if (doneTransition) {
            await requestJira(`${this.url}/${id}/transitions`, this.preparePostMethod({ transition: { id: doneTransition.id } }));
        }
    }
}