import type { Route } from "@forge/api";
import { IRequester } from "./types";
import { requestJira } from "@forge/bridge";

export class FrontJiraRequester implements IRequester {
    async request<T>(url: string | TemplateStringsArray, headers?: Record<string, any>): Promise<T> {
        const result = await requestJira(url as string, headers);
        return result.json() as T;
    }
}