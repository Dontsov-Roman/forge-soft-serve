
export type WebTriggerEvent = {
    headers?: any;
    body?: string;
};

export type WebTriggerResponse = {
    statusCode: number;
    body: string;
};
