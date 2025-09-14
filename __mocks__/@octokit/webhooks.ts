const mockOctokitVerify = jest.fn();

export class Webhooks {
    verify = mockOctokitVerify;

    constructor(_: any) {}
};
export { mockOctokitVerify };