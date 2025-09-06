import { GitService } from "./github";
import { IssueService, JiraRequest } from "./issues";
import { IRouteBuilder } from "./types";

export class Services {
    static githubService: GitService;
    static issueService: IssueService;

    static request: JiraRequest;
    static organization: string;
    static version: string;
    static routeBuilbder: IRouteBuilder;

    static async createGitService() {
        if (!Services.githubService) {
            Services.githubService = new GitService(Services.organization, Services.version);
            await Services.githubService.init();
        }
    }

    static async createIssueService() {
        if (!Services.issueService) {
            Services.issueService = new IssueService(Services.request, Services.routeBuilbder);
        }
    }

    static buildGit(
        organization: string,
        version: string,
    ): Services {
        Services.organization = organization;
        Services.version = version;
        Services.createGitService();
        return Services;
    }

    static async buildIssue(
        request: JiraRequest,
        routeBuilbder: IRouteBuilder,
    ) {
        Services.request = request;
        Services.routeBuilbder = routeBuilbder;
        Services.createIssueService()
    }

    static async getGitHubService(): Promise<GitService>  {
        await Services.createGitService();
        return Services.githubService;
    }

    
    static async getIssueService(): Promise<IssueService>  {
        await Services.createIssueService();
        return Services.issueService;
    }
};