import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import {
  CHANGE_ISSUE_STATUS_DEF,
  GET_ISSUE_DEF,
  GET_ISSUE_TRANSITIONS_DEF,
  GET_PULL_REQUESTS_DEF,
  GET_REPOSITORIES_DEF,
  MERGE_PULL_REQUESTS_DEF,
  MOVE_ISSUE_TO_DONE_DEF,
  REVIEW_PULL_REQUESTS_DEF,
  SET_GIT_HUB_TOKEN_DEF,
} from '../constants';
import {
  AuthPayload,
  ChangeIssueStatusPayload,
  CreateReviewPullRequest,
  GetPullRequestPayload,
  GitRepository,
  Issue,
  IssueKeyPayload,
  MergePullRequestPayload,
} from '../types';
import { IssueTransition } from '../types/IssueTransition';
import { Services } from '../services/Services';
import { buildGitWrapper } from './buildGitWrapper';
import { buildIssueWrapper } from './buildIssueWrapper';

const resolver = new Resolver();
// SOF id = 10000
// SF id = 10033
// b46a79f8-e8ba-45b3-8b5d-173c4fd19d80@connect.atlassian.com
// 712020:1380fbe4-4277-4a31-a32e-07c21ea651ed
// https://api.atlassian.com/ex/jira/eb7467e5-3d18-4d47-9c89-e4661dfe24ef/rest/api/3/user?accountId=712020:1380fbe4-4277-4a31-a32e-07c21ea651ed
resolver.define(GET_REPOSITORIES_DEF, buildGitWrapper<void, GitRepository[]>(async (req) => {
  const gitService = await Services.getGitHubService();
  const repos = await gitService.getRepositories();
  return repos;
}));

resolver.define(GET_PULL_REQUESTS_DEF, buildGitWrapper<GetPullRequestPayload>(async (req) => {
  const gitService = await Services.getGitHubService();
  const pullRequests = await gitService.getPullRequests(req.payload);
  return pullRequests;
}));

resolver.define(MERGE_PULL_REQUESTS_DEF, buildGitWrapper<MergePullRequestPayload>(async (req) => {
  const gitService = await Services.getGitHubService();
  return gitService.mergePullRequest(req.payload);
}));

resolver.define(REVIEW_PULL_REQUESTS_DEF, buildGitWrapper<CreateReviewPullRequest>(async (req) => {
  const gitService = await Services.getGitHubService();
  return gitService.reviewPullRequest(req.payload);
}));

resolver.define(SET_GIT_HUB_TOKEN_DEF, buildGitWrapper<AuthPayload, boolean>(async (req) => {
  const gitService = await Services.getGitHubService();
  return gitService.setToken(req?.payload?.token);
}));

resolver.define(GET_ISSUE_DEF, buildIssueWrapper<IssueKeyPayload, Issue>(async (req) => {
  const issueService = await Services.getIssueService();
  
  return issueService.getIssue(req.payload.key);
}));

resolver.define(GET_ISSUE_TRANSITIONS_DEF, buildIssueWrapper<IssueKeyPayload, IssueTransition[]>(async (req) => {
  const issueService = await Services.getIssueService();
  
  const transitions = await issueService.getTransitions(req.payload.key);
  return transitions;
}));

resolver.define(MOVE_ISSUE_TO_DONE_DEF, buildIssueWrapper<IssueKeyPayload>(async (req): Promise<boolean> => {
  const issueService = await Services.getIssueService();

  if (await issueService.moveToDone(req.payload.key)) {
    return true;
  };
  throw 'Issue couldn\'t move to done';
}));

resolver.define(CHANGE_ISSUE_STATUS_DEF, buildIssueWrapper<ChangeIssueStatusPayload>(async (req): Promise<boolean> => {
  const issueService = await Services.getIssueService();
  if (await issueService.changeIssueStatus(req.payload.key, req.payload.status)) {
    return true;
  };
  throw `Issue couldn\'t move to this status`;
}));

export const handler = resolver.getDefinitions();
