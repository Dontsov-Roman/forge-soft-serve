import { GitHook, WebTriggerEvent, WebTriggerResponse } from "../../types";
import { getIssueKey } from "../../utils";
import { RESPONSE } from "../response";
import { ChainAbstractHandler } from "../../types";

export class CheckActionHandler extends ChainAbstractHandler {

    private action: string;

    constructor(action: string) {
        super();
        this.action = action;
    }

    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        console.log(hook?.action, hook?.pull_request?.title);
        const key = getIssueKey(hook?.pull_request?.title || "");

        if (!key || hook?.action !== this.action) {
            console.log(RESPONSE.BAD_REQUEST);
            return RESPONSE.BAD_REQUEST;
        }

        return super.handle(request, hook);
    }
}
