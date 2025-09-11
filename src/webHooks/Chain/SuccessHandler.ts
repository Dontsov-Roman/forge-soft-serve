import { GitHook, WebTriggerEvent, WebTriggerResponse } from "../../types";
import { RESPONSE } from "../response";
import { ChainAbstractHandler } from "../../types";

export class SuccessHandler extends ChainAbstractHandler {

    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        console.log(RESPONSE.OK);
        return RESPONSE.OK;
    }
}
