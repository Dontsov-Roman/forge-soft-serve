import Resolver from '@forge/resolver';
import { GitService } from '../services/github';
import {
  GET_PULL_REQUESTS_DEF,
  GET_REPOSITORIES_DEF,
  GIT_HUB_ORG,
  GIT_HUB_VERSION,
  MERGE_PULL_REQUESTS_DEF,
  REVIEW_PULL_REQUESTS_DEF,
  SET_GIT_HUB_TOKEN_DEF,
} from '../constants';
import { AuthPayload } from '../types';

const resolver = new Resolver();

const gitService = new GitService(GIT_HUB_ORG, GIT_HUB_VERSION);

resolver.define(GET_REPOSITORIES_DEF, async (req) => {
  return gitService.getRepositories();
});

resolver.define(GET_PULL_REQUESTS_DEF, async (req) => {
  return gitService.getPullRequests(req.payload);
});

resolver.define(MERGE_PULL_REQUESTS_DEF, async (req) => {
  return gitService.mergePullRequest(req.payload);
});

resolver.define(REVIEW_PULL_REQUESTS_DEF, async (req) => {
  return gitService.reviewPullRequest(req.payload);
});

resolver.define(SET_GIT_HUB_TOKEN_DEF, async (req: { payload: AuthPayload }) => {
  return gitService.setToken(req?.payload?.token);
});

export const handler = resolver.getDefinitions();
