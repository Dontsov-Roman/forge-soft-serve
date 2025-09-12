import React, { createContext, useCallback, useState } from 'react';
import { ContextModalValue, ModalProviderProps, ShowModalProps } from './types';
import { ConfirmModal } from '../shared/ConfirmModal';

export const ModalContext = createContext<ContextModalValue>({
    showModal: () => { },
    isOpen: false,
});

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [
        { onConfirm: confirm, onCancel: cancel, cancelLabel, confirmLabel, body, title },
        setModalProps
    ] = useState<ShowModalProps>({ onConfirm: () => { }, onCancel: () => { }, isOpen });

    const showModal = useCallback((props: ShowModalProps) => {
        setModalProps((prev) => ({ ...prev, ...props }));
        setIsOpen(true);
    }, [setIsOpen]);

    const onCancel = useCallback(() => {
        cancel?.();
        setIsOpen(false);
    }, [cancel, setIsOpen]);

    const onConfirm = useCallback(() => {
        confirm?.();
        setIsOpen(false);
    }, [confirm, setIsOpen]);

    return (
        <ModalContext.Provider value={{ showModal, isOpen }}>
            {children}
            <ConfirmModal
                isOpen={isOpen}
                cancelLabel={cancelLabel}
                confirmLabel={confirmLabel}
                title={title}
                body={body}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        </ModalContext.Provider>
    );
};