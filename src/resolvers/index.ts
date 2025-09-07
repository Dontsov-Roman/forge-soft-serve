import Resolver from '@forge/resolver';

import {
  CHANGE_ISSUE_STATUS_DEF,
  GET_ISSUE_DEF,
  GET_ISSUE_TRANSITIONS_DEF,
  GET_PULL_REQUESTS_DEF,
  GET_REPOSITORIES_DEF,
  GIT_HUB_ORG,
  GIT_HUB_VERSION,
  MERGE_PULL_REQUESTS_DEF,
  MOVE_ISSUE_TO_DONE_DEF,
  REVIEW_PULL_REQUESTS_DEF,
  SET_GIT_HUB_TOKEN_DEF,
} from '../constants';
import { AuthPayload, Issue } from '../types';
import { Services } from '../services/Services';
import { BackJiraRequesterStrategy } from '../services/BackJiraRequesterStrategy';
import { IssueTransition } from '../types/IssueTransition';

const resolver = new Resolver();
const requesterStrategy = new BackJiraRequesterStrategy();

resolver.define(GET_REPOSITORIES_DEF, async (req) => {
  await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
  const gitService = await Services.getGitHubService();
  return gitService.getRepositories();
});

resolver.define(GET_PULL_REQUESTS_DEF, async (req) => {
  await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
  const gitService = await Services.getGitHubService();
  return gitService.getPullRequests(req.payload);
});

resolver.define(MERGE_PULL_REQUESTS_DEF, async (req) => {
  await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
  const gitService = await Services.getGitHubService();
  return gitService.mergePullRequest(req.payload);
});

resolver.define(REVIEW_PULL_REQUESTS_DEF, async (req) => {
  await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
  const gitService = await Services.getGitHubService();
  return gitService.reviewPullRequest(req.payload);
});

resolver.define(SET_GIT_HUB_TOKEN_DEF, async (req: { payload: AuthPayload }) => {
  await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
  const gitService = await Services.getGitHubService();
  return gitService.setToken(req?.payload?.token);
});

resolver.define(GET_ISSUE_DEF, async (req: { payload: { key: string } }): Promise<Issue> => {
  await Services.buildIssue(requesterStrategy);
  const issueService = await Services.getIssueService();
  
  return issueService.getIssue(req.payload.key);
});

resolver.define(GET_ISSUE_TRANSITIONS_DEF, async (req: { payload: { key: string } }): Promise<IssueTransition[]> => {
  await Services.buildIssue(requesterStrategy);
  const issueService = await Services.getIssueService();
  
  return issueService.getTransitions(req.payload.key);
});

resolver.define(MOVE_ISSUE_TO_DONE_DEF, async (req: { payload: { key: string } }): Promise<boolean> => {
  await Services.buildIssue(requesterStrategy);
  const issueService = await Services.getIssueService();
  if (await issueService.moveToDone(req.payload.key)) {
    return true;
  };
  throw 'Issue couldn\'t move to done';
});

resolver.define(CHANGE_ISSUE_STATUS_DEF, async (req: { payload: { key: string, status: string } }): Promise<boolean> => {
  await Services.buildIssue(requesterStrategy);
  const issueService = await Services.getIssueService();
  if (await issueService.changeIssueStatus(req.payload.key, req.payload.status)) {
    return true;
  };
  throw `Issue couldn\'t move to this status`;
});

export const handler = resolver.getDefinitions();

