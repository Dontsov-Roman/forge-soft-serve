import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';
import { GET_REPOSITORIES_DEF } from '../constants';
import { GitRepository } from '../types';
import { RepoItem } from './components/RepoItem';

const App = () => {
  const [data, setData] = useState<GitRepository[]>([]);
  useEffect(() => {
    invoke<GitRepository[]>(GET_REPOSITORIES_DEF).then(setData);
  }, []);
  return (
    <>
      <Text align="center">Forge Soft Serve</Text>
      <Text>{data?.length ? data.map((repo) => <RepoItem key={repo.id} repo={repo} />) : 'Loading...'}</Text>
    </>
  );
};
ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
