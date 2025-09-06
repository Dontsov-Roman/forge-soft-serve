
export interface IRequester {
    request<T>(url: string | TemplateStringsArray, headers?: Record<string, any>): Promise<T>;
}
