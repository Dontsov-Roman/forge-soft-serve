export type GetPullRequestPayload = {
    owner: string;
    repo: string;
};

export type MergePullRequestPayload = {
    owner: string;
    repo: string;
    pull_number: number;
    commit_title?: string;
    commit_message?: string;
}