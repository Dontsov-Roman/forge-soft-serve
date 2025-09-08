import { Webhooks } from "@octokit/webhooks";
import { GIT_HUB_WEB_HOOK_SECRET_KEY } from "../constants";

const webhooks = new Webhooks({
  secret: process.env.GIT_HUB_WEB_HOOK_SECRET_KEY || GIT_HUB_WEB_HOOK_SECRET_KEY,
});

export const checkHook = async (signature: string, body: string): Promise<boolean> => await webhooks.verify(body, signature);