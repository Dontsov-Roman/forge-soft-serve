import Resolver from '@forge/resolver';
import api, { route } from "@forge/api";
import {
  GET_ISSUE_DEF,
  GET_PULL_REQUESTS_DEF,
  GET_REPOSITORIES_DEF,
  GIT_HUB_ORG,
  GIT_HUB_VERSION,
  MERGE_PULL_REQUESTS_DEF,
  REVIEW_PULL_REQUESTS_DEF,
  SET_GIT_HUB_TOKEN_DEF,
} from '../constants';
import { AuthPayload, Issue } from '../types';
import { Services } from '../services/Services';
import { BackJiraRequester } from '../services/BackJiraRequester';

const resolver = new Resolver();


Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);

resolver.define(GET_REPOSITORIES_DEF, async (req) => {
  const gitService = await Services.getGitHubService();
  return gitService.getRepositories();
});

resolver.define(GET_PULL_REQUESTS_DEF, async (req) => {
  const gitService = await Services.getGitHubService();
  return gitService.getPullRequests(req.payload);
});

resolver.define(MERGE_PULL_REQUESTS_DEF, async (req) => {
  const gitService = await Services.getGitHubService();
  return gitService.mergePullRequest(req.payload);
});

resolver.define(REVIEW_PULL_REQUESTS_DEF, async (req) => {
  const gitService = await Services.getGitHubService();
  return gitService.reviewPullRequest(req.payload);
});

resolver.define(SET_GIT_HUB_TOKEN_DEF, async (req: { payload: AuthPayload }) => {
  const gitService = await Services.getGitHubService();
  return gitService.setToken(req?.payload?.token);
});

resolver.define(GET_ISSUE_DEF, async (req: { payload: { key: string } }): Promise<Issue> => {
  const requester = new BackJiraRequester()
  await Services.buildIssue(requester);
  const issueService = await Services.getIssueService();
  console.log(req.payload);
  
  // const result = await request(route`/rest/api/3/issue/${req.payload.key}`);
  // const issue = (await result.json());
  // console.log(issue);
  // return issue;
  return issueService.getIssue(req.payload.key);
});
export const handler = resolver.getDefinitions();
