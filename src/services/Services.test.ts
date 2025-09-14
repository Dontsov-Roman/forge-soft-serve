import { mockRequestJira } from "@forge/api";
import { mockOctokitRequest } from "octokit";
import {
    MOCKED_ISSUE_TRANSITION,
    MOCKED_MERGE_RESPONSE,
    MOCKED_REPO,
    MOCKED_PR,
    MOCKED_ISSUE,
} from 'mock-data';

import { Services } from "./Services";
import { GIT_HUB_ORG, GIT_HUB_VERSION } from "../constants";
import { GitService } from "./GithubService";
import { BackAppJiraRequesterStrategy } from "./JiraIssue/BackAppJiraRequesterStrategy";
import { JiraIssuesService } from "./JiraIssue/JiraIssuesService";
import { BackUserJiraRequesterStrategy } from "./JiraIssue/BackUserJiraRequesterStrategy";
import { FrontJiraRequesterStrategy } from "./JiraIssue/FrontJiraRequesterStrategy";
import { PullRequestEventEnum } from "../types";


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

    it("Review Pull Request", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: MOCKED_MERGE_RESPONSE });
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        const service = await Services.getGitHubService();
        await service.reviewPullRequest({ owner: '', repo: '', pull_number: 1, event: PullRequestEventEnum.APPROVE });
        expect(mockOctokitRequest).toHaveBeenCalledTimes(1);
    });

    it("Get repository", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: [MOCKED_REPO] });
        await Services.buildIssue(new BackAppJiraRequesterStrategy());
        const service = await Services.getGitHubService();
        const result = await service.getRepositories();
        expect(result).toStrictEqual([MOCKED_REPO]);
    });

    
    it("Get Pull Requests", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: [MOCKED_PR] });
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        const service = await Services.getGitHubService();
        const result = await service.getPullRequests({ owner: 'owner', repo: 'repo'});
        expect(result).toStrictEqual([MOCKED_PR]);
    });

    it("Merge Pull Request", async () => {
        await mockOctokitRequest.mockResolvedValueOnce({ data: MOCKED_MERGE_RESPONSE });
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        const service = await Services.getGitHubService();
        const result = await service.mergePullRequest({ owner: '', repo: '', pull_number: 1, title: '' });
        expect(result).toStrictEqual(MOCKED_MERGE_RESPONSE);
    });

    
    it("Get issue", async () => {
        await mockRequestJira.mockResolvedValueOnce({
            json: async () => MOCKED_ISSUE
        });
        await Services.buildIssue(new BackAppJiraRequesterStrategy());
        const service = await Services.getIssueService();
        const result = await service.getIssue('key');
        expect(result).toBe(MOCKED_ISSUE);
    });

    it("Get transitions", async () => {
        await mockRequestJira.mockResolvedValueOnce({
            json: async () => ({ transitions: [MOCKED_ISSUE_TRANSITION] })
        });
        await Services.buildIssue(new BackAppJiraRequesterStrategy());
        const service = await Services.getIssueService();
        const result = await service.getTransitions('key');
        expect(result).toStrictEqual([MOCKED_ISSUE_TRANSITION]);
    });
    
    it("Change issue status", async () => {
        await mockRequestJira.mockResolvedValueOnce({
            ok: true
        });
        const service = await Services.getIssueService();
        const result = await service.changeIssueStatus('key', 'closed');
        expect(result).toBe(true);
    });

    it("Move issue to done status, Done transition available", async () => {
        await mockRequestJira.mockResolvedValue({
            json: async () => ({ transitions: [MOCKED_ISSUE_TRANSITION] }),
            ok: true,
        });
        const service = await Services.getIssueService();
        const result = await service.moveToDone('key');
        expect(result).toBe(true);
    });

    it("Move issue to done status, Done transition unavailable", async () => {
        await mockRequestJira.mockResolvedValue({
            json: async () => ({ transitions: [{ ...MOCKED_ISSUE_TRANSITION, isAvailable: false }] }),
            ok: true,
        });
        const service = await Services.getIssueService();
        const result = await service.moveToDone('key');
        expect(result).toBe(false);
    });
    
    it("Move issue to done status, Done transition doesn't exist", async () => {
        await mockRequestJira.mockResolvedValue({
            json: async () => ({ transitions: [{ ...MOCKED_ISSUE_TRANSITION, name: 'Open', to: { name: 'Open' } }] }),
            ok: true,
        });
        const service = await Services.getIssueService();
        const result = await service.moveToDone('key');
        expect(result).toBe(false);
    });
});