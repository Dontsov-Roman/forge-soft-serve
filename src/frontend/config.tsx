import React from 'react';
import ForgeReconciler from '@forge/react';
import { Auth } from './components/auth/Auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MessageProvider } from './components/messages/MessageContext';

const queryClient = new QueryClient();

const Config = () => (
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MessageProvider>
                <Auth />
            </MessageProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
ForgeReconciler.render(<Config />);

ForgeReconciler.addConfig(<Config />);
