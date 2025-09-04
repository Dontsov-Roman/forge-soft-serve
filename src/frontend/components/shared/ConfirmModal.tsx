import React from 'react';
import { 
    Modal,
    ModalBody,
    ModalTransition,
    ModalTitle,
    ModalFooter,
    ModalHeader,
    Button,
} from '@forge/react';

type Props = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    body?: React.ReactNode;
    title?: React.ReactNode;
    cancelLabel?: string;
    confirmLabel?: string
};

export const ConfirmModal: React.FC<Props> = ({
    isOpen = false,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    title = 'Confirm the action',
    body = 'Do you confirm this action?',
    onConfirm,
    onCancel,
}) => (
    <ModalTransition>
        {isOpen && 
            <Modal onClose={onCancel}>
                <ModalHeader>
                    <ModalTitle>
                        {title}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {body}
                </ModalBody>
                <ModalFooter>
                <Button appearance="subtle" onClick={onCancel}>
                    {cancelLabel}
                </Button>
                <Button appearance="primary" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
                </ModalFooter>
            </Modal>
        }
    </ModalTransition>
);