import { Octokit } from "octokit";
import { GetPullRequestPayload, GitPullRequest, GitRepository, MergePullRequestPayload } from "../types";

export class GitService {
    private octokit: Octokit;
    private org: string;
    private version: string;

    constructor(organization: string, version: string) {
        this.org = organization;
        this.version = version;
    }

    private get headers() {
        return {
            'X-GitHub-Api-Version': this.version,
        };
    }

    setToken(auth: string) {
        this.octokit = new Octokit({ auth });
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

    mergePullRequest = async ({
        owner,
        repo,
        pull_number,
        commit_title,
        commit_message,
    }: MergePullRequestPayload): Promise<any> => {
        commit_title = commit_title ?? `Merge PR #${pull_number}`;
        commit_message = commit_message ?? `Merge PR #${pull_number}`;
        console.log(owner, repo, pull_number);
        const result = await this.octokit.request(`PUT /repos/${owner}/${repo}/pulls/${pull_number}/merge`, {
            owner,
            repo,
            pull_number,
            commit_title,
            commit_message,
            headers: this.headers
        });
        console.log(result);
        return result;
    };
}
