import { migrationRunner } from '@forge/sql';
import { GITHUB_TABLE_CREATE, GITHUB_INDEXES_CREATE } from './tables';

const migrations = migrationRunner
    .enqueue('v01_create_table_github', GITHUB_TABLE_CREATE)
    .enqueue('v01_create_indexes_github', GITHUB_INDEXES_CREATE);

export const runMigrations = async () => {
    try {
        const successfulMigrations = await migrations.run();
        console.log('Migrations run Successfully');
        console.log(successfulMigrations);
    } catch (e: any) {
        console.log('Migrations Failed');
        console.log(JSON.stringify(e));
    }
};
