import { GIT_HUB_ACTION_CLOSED } from "../constants";
import { BackAppJiraRequesterStrategy } from "../services/BackAppJiraRequesterStrategy";
import { BackUserJiraRequesterStrategy } from "../services/BackUserJiraRequesterStrategy";
import { Services } from "../services/Services";
import { GitHook } from "../types";
import { getIssueKey } from "../utils/getIssueKey";

interface WebTriggerEvent {
    body?: string;
}

interface WebTriggerResponse {
    statusCode: number;
    body: string;
}

const requesterStrategy = new BackUserJiraRequesterStrategy();

const RESPONSE: Record<string, WebTriggerResponse> = {
  OK: { statusCode: 200, body: 'Ticket closed' },
  NO_BODY: { statusCode: 400, body: "Missing request body" },
  BAD_REQUEST: { statusCode: 400, body: "Bad title in Pull Request or wrong action. Ticket key not found" },
  NOT_FOUND: { statusCode: 404, body: 'Ticket or transition not found' },
  PARSE_ERROR: { statusCode: 400, body: "Some errors appears while parse" },
};

export async function gitMergeHook(
    event: WebTriggerEvent
): Promise<WebTriggerResponse> {
    try {
      if (!event.body) {
        return RESPONSE.NO_BODY;
      }
      await Services.buildIssue(requesterStrategy);

      const body: GitHook = JSON.parse(event.body);
      console.log(body.action, body.pull_request?.title);
      const key = getIssueKey(body.pull_request?.title || "");
      if (!key || body.action !== GIT_HUB_ACTION_CLOSED) {
        console.log(RESPONSE.BAD_REQUEST);
        return RESPONSE.BAD_REQUEST;
      }
      const issueService = await Services.getIssueService();
      if (await issueService.moveToDone(key)) {
        console.log(RESPONSE.OK);
        return RESPONSE.OK;
      }
      console.log(RESPONSE.NOT_FOUND);
      return RESPONSE.NOT_FOUND;
    } catch (err) {
      console.log(err);
      console.log(RESPONSE.PARSE_ERROR);
      return RESPONSE.PARSE_ERROR;
    }
}
