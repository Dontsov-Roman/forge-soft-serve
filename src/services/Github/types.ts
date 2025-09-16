export interface IGithubStrategy { 
    getToken(): Promise<string | undefined>;
    setToken(token: string): Promise<boolean>;
}

export interface IGithubContext {
    setStrategy(strategy: IGithubStrategy): void;
    init(): Promise<void>;
}

export type GithubKeyValueTable = {
    store_key: string;
    value: string;
}