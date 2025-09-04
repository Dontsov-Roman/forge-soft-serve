import React from 'react';
import ForgeReconciler from '@forge/react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
import { Auth } from './components/auth/Auth';
import { MessageProvider } from './components/messages/MessageContext';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MessageProvider>
        <Auth />
      </MessageProvider>
    </QueryClientProvider>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
