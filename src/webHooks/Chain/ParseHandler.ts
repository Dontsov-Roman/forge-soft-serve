import { GitHook, WebTriggerEvent, WebTriggerResponse } from "../../types";
import { RESPONSE } from "../response";
import { ChainAbstractHandler } from "../../types";

export class ParseHandler extends ChainAbstractHandler {

    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        try {
            const hook: GitHook = JSON.parse(request.body || '');
            return super.handle(request, hook);
        } catch (e) {
            return RESPONSE.PARSE_ERROR;
        }
    }
}
