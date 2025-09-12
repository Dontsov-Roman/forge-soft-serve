import { useContext } from "react";
import { ModalContext } from "../components/modal/ModalContext";

export const useModal = () => useContext(ModalContext);
