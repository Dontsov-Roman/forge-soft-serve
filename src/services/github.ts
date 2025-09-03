import { Octokit } from "octokit";
import { GitPullRequest, GitRepository } from "../types";

export class GitService {
    private octokit: Octokit;
    private org: string;
    private version: string;

    constructor(accessToken: string, organization: string, version: string) {
        this.octokit = new Octokit({ auth: accessToken });
        this.org = organization;
        this.version = version;
    }

    private get headers() {
        return {
            'X-GitHub-Api-Version': this.version,
        };
    }

    getRepositories = async (): Promise<GitRepository[]> => {
        const { data } = await this.octokit.request(`GET /orgs/${this.org}/repos`, {
            org: this.org,
            headers: this.headers,
        });

        return data;
    };

    getPullRequests = async (owner: string, repo: string): Promise<GitPullRequest[]> => {
        const { data } = await this.octokit.request(`GET /repos/${owner}/${repo}/pulls`, {
            owner,
            repo,
            headers: this.headers,
        });

        return data;
    };

    mergePullRequest = async (
        owner: string,
        repo: string,
        pull_number: number,
        commit_title?: string,
        commit_message?: string,
    ): Promise<void> => {
        commit_title = commit_title ?? `Merge PR #${pull_number}`;
        commit_message = commit_message ?? `Merge PR #${pull_number}`;
        await this.octokit.request(`PUT /repos/${owner}/${repo}/pulls/${pull_number}/merge`, {
            owner,
            repo,
            pull_number,
            commit_title,
            commit_message,
            headers: this.headers
        });
    };
}
