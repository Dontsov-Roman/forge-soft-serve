import { useContext } from "react";
import { MessageContext } from "../components/messages/MessageContext";

export const useMessage = () => useContext(MessageContext);
