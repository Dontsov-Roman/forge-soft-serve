import Resolver from '@forge/resolver';
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
import { BackJiraRequesterStrategy } from '../services/BackJiraRequesterStrategy';

const resolver = new Resolver();
const requesterStrategy = new BackJiraRequesterStrategy();

Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
Services.buildIssue(requesterStrategy);

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
  const issueService = await Services.getIssueService();
  
  return issueService.getIssue(req.payload.key);
});

export const handler = resolver.getDefinitions();
