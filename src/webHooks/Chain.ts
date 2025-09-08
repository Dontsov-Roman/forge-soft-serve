import { GIT_HUB_ACTION_CLOSED } from "../constants";
import { BackAppJiraRequesterStrategy } from "../services/BackAppJiraRequesterStrategy";
import { Services } from "../services/Services";
import { GitHook } from "../types";
import { WebTriggerEvent, WebTriggerResponse } from "../types/WebTrigger";
import { checkHook } from "../utils/checkHook";
import { getIssueKey } from "../utils/getIssueKey";
import { RESPONSE } from "./response";

export interface Handler<Request = WebTriggerEvent, Body = GitHook, Result = WebTriggerResponse> {
    setNext(handler: Handler<Request, Body, Result>): Handler<Request, Body, Result>;

    handle(request: Request, hook?: Body): Promise<Result | null>;
}

abstract class AbstractHandler<Request = WebTriggerEvent, Body = GitHook, Result = WebTriggerResponse> implements Handler<Request, Body, Result>
{
    private nextHandler!: Handler<Request, Body, Result>;

    public setNext(handler: Handler<Request, Body, Result>): Handler<Request, Body, Result> {
        this.nextHandler = handler;
        return handler;
    }

    public async handle(request: Request, hook?: Body): Promise<Result | null> {
        if (this.nextHandler) {
            return this.nextHandler.handle(request, hook);
        }

        return null;
    }
}
export class ParseHandler extends AbstractHandler {
    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        try {
            const hook: GitHook = JSON.parse(request.body || '');
            return super.handle(request, hook);
        } catch (e) {
            return RESPONSE.PARSE_ERROR;
        }
    }
}

export class CheckCloseActionHandler extends AbstractHandler {
    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        
        console.log(hook?.action, hook?.pull_request?.title);
        const key = getIssueKey(hook?.pull_request?.title || "");
        if (!key || hook?.action !== GIT_HUB_ACTION_CLOSED) {
            console.log(RESPONSE.BAD_REQUEST);
            return RESPONSE.BAD_REQUEST;
        }

        return super.handle(request, hook);
    }
}

export class CheckSignatureHandler extends AbstractHandler {
    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        const [signature] = request.headers['x-hub-signature-256'];
        console.log(signature);
        if (!(await checkHook(signature, request.body || ''))) {
            console.log(RESPONSE.SIGNATURE_FAILED);
            return RESPONSE.SIGNATURE_FAILED;
        }
        console.log('Signature check success');

        return super.handle(request, hook);
    }
}

export class MoveToDoneHandler extends AbstractHandler {
    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        await Services.buildIssue(new BackAppJiraRequesterStrategy());
        const issueService = await Services.getIssueService();
        const key = getIssueKey(hook?.pull_request?.title || "");
        if (!key || !(await issueService.moveToDone(key))) {
            console.log(RESPONSE.NOT_FOUND);
            return RESPONSE.NOT_FOUND;
        }

        return super.handle(request, hook);
    }
}

export class SuccessHandler extends AbstractHandler {
    public async handle(request: WebTriggerEvent, hook?: GitHook): Promise<WebTriggerResponse | null> {
        console.log(RESPONSE.OK);
        return RESPONSE.OK;
    }
}