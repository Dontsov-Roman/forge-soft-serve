import { WebTriggerEvent, WebTriggerResponse } from "../types/WebTrigger";
import {
  ParseHandler,
  CheckCloseActionHandler,
  CheckSignatureHandler,
  MoveToDoneHandler,
  SuccessHandler,
} from "./Chain";

export async function gitMergeHook(
    event: WebTriggerEvent
): Promise<WebTriggerResponse | null> {
  const parseHandler = new ParseHandler();
  const checkAction = new CheckCloseActionHandler();
  const checkSignature = new CheckSignatureHandler();
  const moveToDone = new MoveToDoneHandler();
  const success = new SuccessHandler();

  parseHandler.setNext(checkAction).setNext(checkSignature).setNext(moveToDone).setNext(success);

  return parseHandler.handle(event);
}
