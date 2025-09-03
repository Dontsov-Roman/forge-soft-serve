import { ID } from "./Base";

export type GitUser = ID & {
    avatar_url: string;
    login: string;
};

export type GitLabel = ID & {
    name: string;
    color: string;
    default: boolean;
};

export type GitRepository = ID & {
    name: string;
    full_name: string;
    disabled: boolean;
    commits_url: string;
    pulls_url: string;
    language?: string;
    description?: string;
    updated_at?: string;
    owner: GitUser;
};

export type GitPullRequest = ID & {
    url: string;
    number: number;
    state: string;
    locked: boolean;
    merged_at: string;
    title: string;
    user: GitUser;
    body: string;
    labels: GitLabel[];
};