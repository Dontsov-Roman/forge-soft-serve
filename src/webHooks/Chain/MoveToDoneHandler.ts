import { BackAppJiraRequesterStrategy } from "../../services/JiraIssue/BackAppJiraRequesterStrategy";
import { Services } from "../../services/Services";
import { GitHook, WebTriggerEvent, WebTriggerResponse } from "../../types";
import { getIssueKey } from "../../utils";
import { RESPONSE } from "../response";
import { ChainAbstractHandler } from "../../types";

export class MoveToDoneHandler extends ChainAbstractHandler {
    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        await Services.buildIssue(new BackAppJiraRequesterStrategy());
        const issueService = await Services.getIssueService();
        const key = getIssueKey(hook?.pull_request?.title || "");

        if (!key || !(await issueService.moveToDone(key))) {
            return RESPONSE.NOT_FOUND;
        }

        return super.handle(request, hook);
    }
}

