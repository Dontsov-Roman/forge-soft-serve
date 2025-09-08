import Resolver from '@forge/resolver';
import { asApp, asUser, route } from '@forge/api';
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
import { IssueTransition } from '../types/IssueTransition';
import { Services } from '../services/Services';
import { BackAppJiraRequesterStrategy } from '../services/BackAppJiraRequesterStrategy';
import { BackUserJiraRequesterStrategy } from '../services/BackUserJiraRequesterStrategy';

const resolver = new Resolver();
const requesterStrategy = new BackAppJiraRequesterStrategy();

/*
SOF roles
{
  'atlassian-addons-project-access': 'https://api.atlassian.com/ex/jira/eb7467e5-3d18-4d47-9c89-e4661dfe24ef/rest/api/3/project/10000/role/10007',
  Administrator: 'https://api.atlassian.com/ex/jira/eb7467e5-3d18-4d47-9c89-e4661dfe24ef/rest/api/3/project/10000/role/10004',
  Viewer: 'https://api.atlassian.com/ex/jira/eb7467e5-3d18-4d47-9c89-e4661dfe24ef/rest/api/3/project/10000/role/10006',
  Member: 'https://api.atlassian.com/ex/jira/eb7467e5-3d18-4d47-9c89-e4661dfe24ef/rest/api/3/project/10000/role/10005'
}
*/
resolver.define(GET_REPOSITORIES_DEF, async (req) => {

  // const res = await asApp().requestJira(route`/rest/api/3/myself`);
  // const myself = await res.json();
  // console.log("Application:");
  // console.log(myself);

  // console.log('GET project roles');
  // const res = await asApp().requestJira(route`/rest/api/3/project/SOF/role/10004`);
  // console.log(await res.json());

  // console.log('Grant app access to jira');
  // const res = await asUser().requestJira(route`/rest/api/3/project/SOF/role/1004`,{
    // method: 'POST',
    // headers: {
    //     'Authorization': `Bearer `,
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
      // body: JSON.stringify({"user": ["712020:1380fbe4-4277-4a31-a32e-07c21ea651ed"]}),
  //   });
  // console.log(await res.json());
  await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
  const gitService = await Services.getGitHubService();
  const repos = await gitService.getRepositories();
  return repos;
});

resolver.define(GET_PULL_REQUESTS_DEF, async (req) => {
  await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
  const gitService = await Services.getGitHubService();
  const pullRequests = await gitService.getPullRequests(req.payload);
  return pullRequests;
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
  
  const transitions = await issueService.getTransitions(req.payload.key);
  return transitions;
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

