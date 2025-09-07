import { GitService } from "./GithubService";
import { JiraIssuesService } from "./JiraIssuesService";
import { IIssueRequesterStrategy } from "./types";

export class Services {
    static githubService: GitService;
    static issueService: JiraIssuesService;

    static organization: string;
    static version: string;
    static requestStrategy: IIssueRequesterStrategy;

    static async createGitService() {
        if (!Services.githubService) {
            Services.githubService = new GitService(Services.organization, Services.version);
            await Services.githubService.init();
            console.log('Github service created');
        }
    }

    static async createIssueService() {
        if (!Services.issueService) {
            Services.issueService = new JiraIssuesService(Services.requestStrategy);
            console.log('Issue service created');
        }
    }

    static async buildGit(
        organization: string,
        version: string,
    ) {
        Services.organization = organization;
        Services.version = version;
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