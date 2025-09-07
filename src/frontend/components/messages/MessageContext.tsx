import React, { createContext } from 'react';
import { SectionMessage } from '@forge/react';
import {
    ContextValue,
    ProviderProps,
} from './types'
import { useMessageWrapper } from './useMessageWrapper';

export const MessageContext = createContext<ContextValue>({
    message: '',
    isVisible: false,
    appearance: 'information',
    align: 'bottom',
    showMessage: () => { },
});


export const MessageProvider: React.FC<ProviderProps> = React.memo(({ children, timeout, align }) => {
    const value = useMessageWrapper({ timeout, align });
    return (
        <MessageContext.Provider value={value}>
            {value.isVisible && value.align === 'top' && <SectionMessage appearance={value.appearance}>{value.message}</SectionMessage>}
            {children}
            {value.isVisible && value.align === 'bottom' && <SectionMessage appearance={value.appearance}>{value.message}</SectionMessage>}
        </MessageContext.Provider>
    );
}, ({ align: prevAlign }, { align }) => align === prevAlign);

