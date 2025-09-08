import Resolver from '@forge/resolver';
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
