const mockOctokitRequest = jest.fn();

export class Octokit {
    request = mockOctokitRequest;

    constructor(_: any) {}
};
export { mockOctokitRequest };