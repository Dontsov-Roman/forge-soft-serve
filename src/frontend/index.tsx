import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
import { GET_REPOSITORIES_DEF } from '../constants';
import { GitRepository } from '../types';
import { RepositoryList } from './components/repo/RepositoryList';

const queryClient = new QueryClient();

const App = () => {
  const [data, setData] = useState<GitRepository[]>([]);

  useEffect(() => {
    invoke<GitRepository[]>(GET_REPOSITORIES_DEF).then(setData);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Text align="center">Forge Soft Serve</Text>
      <RepositoryList />
    </QueryClientProvider>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
