import { GitHook } from ".";
import { WebTriggerEvent, WebTriggerResponse } from ".";

export interface IChainHandler<Request = WebTriggerEvent, Body = GitHook, Result = WebTriggerResponse> {

    setNext(handler: IChainHandler<Request, Body, Result>): IChainHandler<Request, Body, Result>;

    handle(request: Request, hook?: Body): Promise<Result | null>;
}

export abstract class ChainAbstractHandler<Request = WebTriggerEvent, Body = GitHook, Result = WebTriggerResponse>
    implements IChainHandler<Request, Body, Result> {
    
    private nextHandler!: IChainHandler<Request, Body, Result>;

    public setNext(handler: IChainHandler<Request, Body, Result>): IChainHandler<Request, Body, Result> {
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
