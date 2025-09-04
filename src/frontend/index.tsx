import React from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
import { RepositoryList } from './components/repo/RepositoryList';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryList />
    </QueryClientProvider>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
