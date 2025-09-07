
export type Appearance = 'information' | 'warning' | 'error' | 'success' | 'discovery';

export type Align = 'top' | 'bottom';

export type DefaultMainHookProps = {
    align?: Align;
    timeout?: number;
};

export type ProviderProps = DefaultMainHookProps & {
    children: React.ReactNode;
};

export type ShowMessageProps = {
    message: string;
    appearance: Appearance;
    align?: Align;
};

export type ContextValue = ShowMessageProps & {
    isVisible: boolean;
    showMessage: (props: ShowMessageProps) => void;
};