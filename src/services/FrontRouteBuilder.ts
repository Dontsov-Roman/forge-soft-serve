import type { Route } from "@forge/api";
import { IRouteBuilder } from "./types";

export class FrontRouteBuilder implements IRouteBuilder {
    buildRoute: (
        url: string | TemplateStringsArray, ...values: any[]
    ) => string | Route = (url: string | TemplateStringsArray, ...values: any[]) => url as string;
}