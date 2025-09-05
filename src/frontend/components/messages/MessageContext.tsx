import React, { createContext, useCallback, useState } from 'react';
import { SectionMessage } from '@forge/react';
import { useSimpleTimeout } from '../../hooks/useSimpleTimeout';

type Appearance = 'information' | 'warning' | 'error' | 'success' | 'discovery';

type Align = 'top' | 'bottom';

type DefaultMainHookProps = {
    align?: Align;
    timeout?: number;
};

type ProviderProps = DefaultMainHookProps & {
    children: React.ReactNode;
};

type ShowMessageProps = {
    message: string;
    appearance: Appearance;
    align?: Align;
};

type ContextValue = ShowMessageProps & {
    isVisible: boolean;
    showMessage: (props: ShowMessageProps) => void;
};

export const MessageContext = createContext<ContextValue>({
    message: '',
    isVisible: false,
    appearance: 'information',
    align: 'bottom',
    showMessage: () => { },
});

const useMessageWrapper = ({ timeout, align: defaultAlign = 'bottom' }: DefaultMainHookProps) => {
    const { enabled: isVisible, onClick: toggleMessage } = useSimpleTimeout(timeout);
    const [appearance, setAppearance] = useState<Appearance>('information');
    const [message, setMessage] = useState('');
    const [align, setAlign] = useState<Align>(defaultAlign);
    const showMessage = useCallback(({ message, appearance = 'information', align }: ShowMessageProps) => {
        setAppearance(appearance);
        setMessage(message);
        if (align) setAlign(align);
        toggleMessage();
    }, [toggleMessage, setMessage, setAppearance]);

    return { showMessage, isVisible, appearance, message, align };
};

export const MessageProvider: React.FC<ProviderProps> = ({ children, ...rest }) => {
    const value = useMessageWrapper(rest);
    return (
        <MessageContext.Provider value={value}>
            {value.isVisible && value.align === 'top' && <SectionMessage appearance={value.appearance}>{value.message}</SectionMessage>}
            {children}
            {value.isVisible && value.align === 'bottom' && <SectionMessage appearance={value.appearance}>{value.message}</SectionMessage>}
        </MessageContext.Provider>
    );
};

