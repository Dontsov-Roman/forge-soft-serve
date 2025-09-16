import { sql } from '@forge/sql'
import { IGithubStrategy, GithubKeyValueTable } from './types';
import { GIT_HUB_STORE_KEY } from '../../constants';

// This one just for a test, in real project it should be managed by some ORM and incapsulated(queries at least)
export class SqlStrategy implements IGithubStrategy {
    async getToken(): Promise<string | undefined> {
        const result = await sql
            .prepare<GithubKeyValueTable>('SELECT * FROM GithubKeys WHERE key = ?')
            .bindParams(GIT_HUB_STORE_KEY)
            .execute();
        return result?.rows[0]?.value;
    }
    async setToken(token: string): Promise<boolean> {
        if (await this.getToken()) {
            await sql
                .prepare<GithubKeyValueTable>('INSERT INTO GithubKeys VALUES (?, ?)')
                .bindParams(GIT_HUB_STORE_KEY, token)
                .execute();
        } else {
            await sql
                .prepare<GithubKeyValueTable>('UPDATE GithubKeys SET value=? WHERE key=?')
                .bindParams(token, GIT_HUB_STORE_KEY)
                .execute();
        }
        return true;
    }
}
