import { invoke } from "@forge/bridge";
import { mutationOptions } from "@tanstack/react-query";
import { SET_GIT_HUB_TOKEN_DEF } from "../../../constants";
import { AUTH_KEY } from "../../keys";
import { AuthPayload } from "../../../types";

export const authMutation = () => mutationOptions({
    mutationKey: [AUTH_KEY],
    mutationFn: (payload: AuthPayload) => invoke(SET_GIT_HUB_TOKEN_DEF, payload),
});