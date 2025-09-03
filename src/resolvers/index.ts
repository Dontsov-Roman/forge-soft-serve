import Resolver from '@forge/resolver';
import { GitService } from '../services/github';
import { GET_REPOSITORIES_DEF, GIT_HUB_ACCESS_TOKEN, GIT_HUB_ORG, GIT_HUB_VERSION } from '../constants';

const resolver = new Resolver();
const gitService = new GitService(GIT_HUB_ACCESS_TOKEN, GIT_HUB_ORG, GIT_HUB_VERSION);
resolver.define(GET_REPOSITORIES_DEF, async (req) => {
  console.log(req);
  return gitService.getRepositories();
});

export const handler = resolver.getDefinitions();
