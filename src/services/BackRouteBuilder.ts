
import { Route, route } from '@forge/api';
import { IRouteBuilder } from "./types";

export class BackRouteBuilder implements IRouteBuilder {
    buildRoute: (
        url: string | TemplateStringsArray, ...values: any[]
    ) => string | Route = (url: string | TemplateStringsArray, ...values: any[]) => route(url as TemplateStringsArray, ...values);
}