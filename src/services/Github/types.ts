export interface IGithubStoreStrategy { 
    getToken(): Promise<string | undefined>;
    setToken(token: string): Promise<boolean>;
}

export interface IGithubContext {
    setStrategy(strategy: IGithubStoreStrategy): void;
    init(): Promise<void>;
}

export type GithubKeyValueTable = {
    store_key: string;
    value: string;
}