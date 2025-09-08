import { useCallback, useEffect, useRef, useState } from 'react';
import {
    DefaultMainHookProps,
    Align,
    Appearance,
    ShowMessageProps,
} from './types'

export const useMessageWrapper = ({ timeout, align: defaultAlign = 'bottom' }: DefaultMainHookProps) => {
    const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isVisible, setVisible] = useState(false);
    const toggleMessage = useCallback(() => {
        setVisible(true);
        if (ref.current)
            clearTimeout(ref.current);
        // ref.current = setTimeout(() => {
        //     setVisible(false);
        //     ref.current = null;
        // }, timeout);
    }, []);

    useEffect(() => {
        return () => {
            if(ref.current) clearTimeout(ref.current);
        }
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
