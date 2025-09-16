import { sql } from '@forge/sql'
import { IGithubStoreStrategy, GithubKeyValueTable } from './types';
import { GIT_HUB_STORE_KEY } from '../../constants';
import { GITHUB_TABLE_NAME } from '../../migrations/tables';

// This one just for a test, in real project it should be managed by some ORM and incapsulated(queries at least)
export class SqlStrategy implements IGithubStoreStrategy {
    async getToken(): Promise<string | undefined> {
        const result = await sql
            .prepare<GithubKeyValueTable>(`SELECT * FROM ${GITHUB_TABLE_NAME} WHERE store_key = ?`)
            .bindParams(GIT_HUB_STORE_KEY)
            .execute();
        return result?.rows[0]?.value;
    }
    async setToken(token: string): Promise<boolean> {
        if (await this.getToken()) {
            await sql
                .prepare<GithubKeyValueTable>(`UPDATE ${GITHUB_TABLE_NAME} SET value = ? WHERE store_key = ?`)
                .bindParams(token, GIT_HUB_STORE_KEY)
                .execute();
        } else {
            await sql
                .prepare<GithubKeyValueTable>(`INSERT INTO ${GITHUB_TABLE_NAME} (store_key, value) VALUES (?, ?)`)
                .bindParams(GIT_HUB_STORE_KEY, token)
                .execute();
        }
        return true;
    }
}
