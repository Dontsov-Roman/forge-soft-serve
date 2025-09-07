import { Issue } from "../types";
import { IssueTransition } from "../types/IssueTransition";

export type Headers = Record<string, any>;
export interface IIssueRequesterStrategy {
    getTransitions(id: string, headers?: Headers): Promise<IssueTransition[]>;
    getIssue(key: string, headers?: Headers): Promise<Issue>;
    changeIssueStatus(key: string, headers?: Headers): Promise<boolean>;
}
