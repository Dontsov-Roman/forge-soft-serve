import React from "react";

export type ShowModalProps = {
    onConfirm: () => void;
    onCancel?: () => void;
    isOpen?: boolean;
    body?: React.ReactNode;
    title?: React.ReactNode;
    cancelLabel?: string;
    confirmLabel?: string
};

export type ContextModalValue = {
    showModal: (props: ShowModalProps) => void;
    isOpen: boolean;
};

export type ModalProviderProps = {
    children: React.ReactNode;
};
