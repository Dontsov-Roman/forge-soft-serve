import React from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
import { RepositoryList } from './components/repo/RepositoryList';
import { Auth } from './components/auth/Auth';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Text align="center">Forge Soft Serve</Text>
      <Auth />
      <RepositoryList />
    </QueryClientProvider>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
