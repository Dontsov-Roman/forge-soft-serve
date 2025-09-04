export type GetPullRequestPayload = {
    owner: string;
    repo: string;
};

export type MergePullRequestPayload = {
    owner: string | number;
    repo: string | number;
    pull_number: number;
    title: string;
    commit_title?: string;
    commit_message?: string;
}
export type AuthPayload = {
    token: string;
};