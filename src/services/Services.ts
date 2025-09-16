import { GitService } from "./Github/GithubService";
import { KvsStrategy } from "./Github/KvsStrategy";
import { IGithubStoreStrategy } from "./Github/types";
import { JiraIssuesService } from "./JiraIssue/JiraIssuesService";
import { IIssueRequesterStrategy } from "./JiraIssue/types";

export class Services {
    static githubService: GitService;
    static issueService: JiraIssuesService;

    static organization: string;
    static version: string;
    static requestStrategy: IIssueRequesterStrategy;
    static githubStrategy: IGithubStoreStrategy;

    static async createGitService() {
        if (!Services.githubService) {
            Services.githubService = new GitService(Services.organization, Services.version, Services.githubStrategy);
            await Services.githubService.init();
        }
    }

    static async createIssueService() {
        if (!Services.issueService) {
            Services.issueService = new JiraIssuesService(Services.requestStrategy);
        }
    }

    static async buildGit(
        organization: string,
        version: string,
        githubStrategy = new KvsStrategy(),
    ) {
        Services.organization = organization;
        Services.version = version;
        Services.githubStrategy = githubStrategy;
        return Services.createGitService();
    }

    static async buildIssue(
        requester: IIssueRequesterStrategy,
    ) {
        Services.requestStrategy = requester;
        return Services.createIssueService();
    }

    static async getGitHubService(): Promise<GitService>  {
        await Services.createGitService();
        return Services.githubService;
    }

    static async getIssueService(): Promise<JiraIssuesService>  {
        await Services.createIssueService();
        return Services.issueService;
    }
};