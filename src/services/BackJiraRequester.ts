import { route, asApp } from '@forge/api';
import { IRequester } from "./types";

export class BackJiraRequester implements IRequester {
    async request<T>(url: any, headers: Record<string, any>): Promise<T> {
        const request = asApp().requestJira;
        const result = await request(route(url as TemplateStringsArray), headers);
        return result.json() as T;
    }
}