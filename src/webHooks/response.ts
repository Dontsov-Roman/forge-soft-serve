import { WebTriggerResponse } from "../types/WebTrigger";

export const RESPONSE: Record<string, WebTriggerResponse> = {
  OK: { statusCode: 200, body: 'Ticket closed' },
  NO_BODY: { statusCode: 400, body: "Missing request body" },
  BAD_REQUEST: { statusCode: 400, body: "Bad title in Pull Request or wrong action. Ticket key not found" },
  SIGNATURE_FAILED: { statusCode: 401, body: "Check signature failed" },
  NOT_FOUND: { statusCode: 404, body: 'Ticket or transition not found' },
  PARSE_ERROR: { statusCode: 400, body: "Some errors appears while parse" },
};