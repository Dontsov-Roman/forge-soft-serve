import { mockRequestJira } from "@forge/api";
import { mockOctokitRequest } from "octokit";
import { Services } from "./Services";
import { GIT_HUB_ORG, GIT_HUB_VERSION } from "../constants";
import { GitService } from "./GithubService";
import { BackAppJiraRequesterStrategy } from "./JiraIssue/BackAppJiraRequesterStrategy";
import { JiraIssuesService } from "./JiraIssue/JiraIssuesService";
import { BackUserJiraRequesterStrategy } from "./JiraIssue/BackUserJiraRequesterStrategy";
import { FrontJiraRequesterStrategy } from "./JiraIssue/FrontJiraRequesterStrategy";
import { GitLabel, GitPullRequest, GitRepository, GitUser, MergePullRequestResponse, PullRequestEventEnum } from "../types";

const MOCKED_GIT_USER: GitUser = {
    id: 1,
    avatar_url: 'string',
    login: 'string'
};
const MOCKED_GIT_LABEL: GitLabel = {
    id: 1,
    name: 'name',
    color: 'color',
    default: true,
};
const MOCKED_REPO: GitRepository = {
    id: 1,
    name: 'string',
    full_name: 'string',
    disabled: false,
    commits_url: 'string',
    pulls_url: 'string',
    language: 'string',
    description: 'string',
    updated_at: 'string',
    html_url: 'string',
    owner: MOCKED_GIT_USER,
};
const MOCKED_PR: GitPullRequest = {
    id: 1,
    url: 'string',
    html_url: 'string',
    number: 1,
    state: 'string',
    locked: false,
    merged_at: 'string',
    created_at: 'string',
    updated_at: 'string',
    title: 'string',
    user: MOCKED_GIT_USER,
    body: 'string',
    labels: [MOCKED_GIT_LABEL],
    base: {
        repo: MOCKED_REPO,
        label: 'string',
        ref: 'string',
    }
};
const MOCKED_MERGE_RESPONSE: MergePullRequestResponse = {
    message: 'Merged',
    merged: true,
    sha: 'sha',
};
describe("Services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Build Git", async () => {
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        expect(await Services.getGitHubService()).toBeInstanceOf(GitService);
    });
    
    it("Build Issue Service with BackApp strategy", async () => {
        await Services.buildIssue(new BackAppJiraRequesterStrategy());
        expect(await Services.getIssueService()).toBeInstanceOf(JiraIssuesService);
    });
    
    it("Build Issue Service with BackUser strategy", async () => {
        await Services.buildIssue(new BackUserJiraRequesterStrategy());
        expect(await Services.getIssueService()).toBeInstanceOf(JiraIssuesService);
    });
    
    it("Build Issue Service with Front strategy", async () => {
        await Services.buildIssue(new FrontJiraRequesterStrategy());
        expect(await Services.getIssueService()).toBeInstanceOf(JiraIssuesService);
    });

    it("Review Pull Request from Service", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: MOCKED_MERGE_RESPONSE });
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        const service = await Services.getGitHubService();
        await service.reviewPullRequest({ owner: '', repo: '', pull_number: 1, event: PullRequestEventEnum.APPROVE });
        expect(mockOctokitRequest).toHaveBeenCalledTimes(1);
    });

    it("Get repository from Service", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: [MOCKED_REPO] });
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        const service = await Services.getGitHubService();
        const repos = await service.getRepositories();
        expect(repos).toStrictEqual([MOCKED_REPO]);
    });

    
    it("Get Pull Requests from Service", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: [MOCKED_PR] });
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        const service = await Services.getGitHubService();
        const repos = await service.getPullRequests({ owner: 'owner', repo: 'repo'});
        expect(repos).toStrictEqual([MOCKED_PR]);
    });

    it("Merge Pull Request from Service", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: MOCKED_MERGE_RESPONSE });
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        const service = await Services.getGitHubService();
        const repos = await service.mergePullRequest({ owner: '', repo: '', pull_number: 1, title: '' });
        expect(repos).toStrictEqual(MOCKED_MERGE_RESPONSE);
    });
});