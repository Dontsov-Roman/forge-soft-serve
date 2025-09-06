import type { Route } from '@forge/api';

export interface IRouteBuilder {
    buildRoute: (url: string | TemplateStringsArray, ...values: any[]) => string | Route;
}
