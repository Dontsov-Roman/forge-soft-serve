import { ResolverFunction } from "@forge/resolver";
import { Services } from "../services/Services";
import { BackAppJiraRequesterStrategy } from "../services/JiraIssue/BackAppJiraRequesterStrategy";
import { BackUserJiraRequesterStrategy } from "../services/JiraIssue/BackUserJiraRequesterStrategy";

const requesterStrategy = new BackAppJiraRequesterStrategy();

export function buildIssueWrapper<Args = never, R = unknown>(cb: ResolverFunction<Args, R>): ResolverFunction<Args, R> {
    const resolver: ResolverFunction<Args, R> = async (...args) => {
        await Services.buildIssue(requesterStrategy);
        return cb(...args);
    }
    return resolver;
};