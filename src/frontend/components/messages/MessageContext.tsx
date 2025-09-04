import React, { createContext, useCallback, useContext, useState } from 'react';
import { SectionMessage } from '@forge/react';
import { useSimpleTimeout } from '../../hooks/useSimpleTimeout';

type Appearance = 'information' | 'warning' | 'error' | 'success' | 'discovery'; 
type ShowMessageProps = {
    message: string;
    appearance: Appearance;
};
type ContextValue = ShowMessageProps & {
    isVisible: boolean;
    showMessage: (props: ShowMessageProps) => void;
};

export const MessageContext = createContext<ContextValue>({
    message: '',
    isVisible: false,
    appearance: 'information',
    showMessage: () => { },
});

const useMessageWrapper = () => {
    const { enabled: isVisible, onClick: toggleMessage } = useSimpleTimeout();
    const [appearance, setAppearance] = useState<Appearance>('information');
    const [message, setMessage] = useState('');
    const showMessage = useCallback(({ message, appearance = 'information' }: ShowMessageProps) => {
        setAppearance(appearance);
        setMessage(message);
        toggleMessage()
    }, [toggleMessage, setMessage, setAppearance]);

    return { showMessage, isVisible, appearance, message };
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useMessageWrapper();
    return (
        <MessageContext.Provider value={value}>
            {children}
            {value.isVisible && <SectionMessage appearance={value.appearance}>{value.message}</SectionMessage>}
        </MessageContext.Provider>
    );
};

export const useMessage = () => useContext(MessageContext);
