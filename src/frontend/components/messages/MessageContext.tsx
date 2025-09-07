import React, { createContext, useCallback, useRef, useState } from 'react';
import { SectionMessage } from '@forge/react';

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
    const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isVisible, setVisible] = useState(false);
    const toggleMessage = useCallback(() => {
        setVisible(true);
        if (ref.current)
            clearTimeout(ref.current);
        ref.current = setTimeout(() => {
            setVisible(false);
            ref.current = null;
        }, timeout);
    }, []);

    const [appearance, setAppearance] = useState<Appearance>('information');
    const [message, setMessage] = useState('');
    const [align, setAlign] = useState<Align>(defaultAlign);
    const showMessage = useCallback(({ message, appearance = 'information', align }: ShowMessageProps) => {
        setAppearance(appearance);
        setMessage(message);
        if (align) setAlign(align);
        toggleMessage();
    }, []);

    return { showMessage, isVisible, appearance, message, align };
};

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

