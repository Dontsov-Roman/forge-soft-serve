export type GetPullRequestPayload = {
    owner: string;
    repo: string;
};

export enum PullRequestEventEnum {
    REQUEST_CHANGES = 'REQUEST_CHANGES',
    APPROVE = 'APPROVE',
    COMMENT = 'COMMENT',
    PENDING = 'PENDING',
};

export type MergePullRequestPayload = GetPullRequestPayload & {
    pull_number: number;
    title: string;
    commit_title?: string;
    commit_message?: string;
}
export type MergePullRequestResponse = {
    message: string;
    merged: boolean;
    sha: string;
};
export type CreateReviewPullRequest = GetPullRequestPayload & {
    pull_number: number;
    event: PullRequestEventEnum;
    body?: string;
}
export type AuthPayload = {
    token: string;
};