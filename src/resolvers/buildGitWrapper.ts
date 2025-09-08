import { ResolverFunction } from "@forge/resolver";
import { GIT_HUB_ORG, GIT_HUB_VERSION } from "../constants";
import { Services } from "../services/Services";

export function buildGitWrapper<Args = never, R = unknown>(cb: ResolverFunction<Args, R>): ResolverFunction<Args, R> {
    const resolver: ResolverFunction<Args, R> = async (...args) => {
        await Services.buildGit(GIT_HUB_ORG, GIT_HUB_VERSION);
        return cb(...args);
    }
    return resolver;
};