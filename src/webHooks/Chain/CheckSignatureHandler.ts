import { GitHook, WebTriggerEvent, WebTriggerResponse } from "../../types";
import { checkHook } from "../../utils";
import { RESPONSE } from "../response";
import { ChainAbstractHandler } from "../../types";

export class CheckSignatureHandler extends ChainAbstractHandler {

    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        const [signature] = request.headers['x-hub-signature-256'];

        if (!(await checkHook(signature, request.body || ''))) {
            return RESPONSE.SIGNATURE_FAILED;
        }

        return super.handle(request, hook);
    }
}
