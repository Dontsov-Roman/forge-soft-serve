import React from 'react';
import ForgeReconciler, { useProductContext } from '@forge/react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
import { RepositoryList } from './components/repo/RepositoryList';
import { MessageProvider } from './components/messages/MessageContext';

const queryClient = new QueryClient();

const App = () => {
  const context = useProductContext();
  return (
    <QueryClientProvider client={queryClient}>
      <MessageProvider align='top' timeout={5000}>
        <RepositoryList />
      </MessageProvider>
    </QueryClientProvider>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
