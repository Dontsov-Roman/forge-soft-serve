import { Octokit } from "octokit";
import { kvs } from '@forge/kvs'
import { CreateReviewPullRequest, GetPullRequestPayload, GitPullRequest, GitRepository, MergePullRequestPayload } from "../types";
import { GIT_HUB_STORE_KEY } from "../constants";

export class GitService {
    private octokit: Octokit;
    private org: string;
    private version: string;

    constructor(organization: string, version: string) {
        this.org = organization;
        this.version = version;
        this.init();
    }

    private get headers() {
        return {
            'X-GitHub-Api-Version': this.version,
        };
    }

    private async init() {
        const auth = await kvs.get(GIT_HUB_STORE_KEY);
        this.octokit = new Octokit({ auth });
    }

    setToken(auth: string) {
        this.octokit = new Octokit({ auth });
        kvs.set(GIT_HUB_STORE_KEY, auth);
    }

    getRepositories = async (): Promise<GitRepository[]> => {
        const { data } = await this.octokit.request(`GET /orgs/${this.org}/repos`, {
            org: this.org,
            headers: this.headers,
        });

        return data;
    };

    getPullRequests = async ({ owner, repo }: GetPullRequestPayload): Promise<GitPullRequest[]> => {
        const { data } = await this.octokit.request(`GET /repos/${owner}/${repo}/pulls`, {
            owner,
            repo,
            headers: this.headers,
        });

        return data;
    };

    reviewPullRequest = async ({
        owner,
        repo,
        pull_number,
        event,
        body = 'Automatic message, approved via Forge',
    }: CreateReviewPullRequest) => {
        await this.octokit.request(`POST /repos/${owner}/${repo}/pulls/${pull_number}/reviews`, {
            owner,
            repo,
            pull_number,
            event,
            body,
            headers: this.headers
        })
    };

    mergePullRequest = async ({
        owner,
        repo,
        pull_number,
        commit_title,
        commit_message,
    }: MergePullRequestPayload): Promise<{ data: { message: string; }}> => {
        commit_title = commit_title ?? `Merge PR #${pull_number}`;
        commit_message = commit_message ?? `Merge PR #${pull_number}`;
        const { data } = await this.octokit.request(`PUT /repos/${owner}/${repo}/pulls/${pull_number}/merge`, {
            owner,
            repo,
            pull_number,
            commit_title,
            commit_message,
            merge_method: "squash",
            headers: this.headers
        });
        return data;
    };
}
