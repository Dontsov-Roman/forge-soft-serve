import { kvs } from '@forge/kvs'
import { IGithubStoreStrategy } from './types';
import { GIT_HUB_STORE_KEY } from '../../constants';

export class KvsStrategy implements IGithubStoreStrategy {
    async getToken(): Promise<string | undefined> {
         return kvs.getSecret(GIT_HUB_STORE_KEY);
    }
    async setToken(token: string): Promise<boolean> {
        kvs.setSecret(GIT_HUB_STORE_KEY, token);
        return true;
    }
}
