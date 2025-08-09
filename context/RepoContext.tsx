
import React, { createContext, useState, useMemo, useEffect } from 'react';

interface RepoContextType {
  owner: string;
  repo: string;
  setRepo: (owner: string, repo: string) => void;
}

export const RepoContext = createContext<RepoContextType>({
  owner: '',
  repo: '',
  setRepo: () => {},
});

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [owner, setOwner] = useState<string>(() => localStorage.getItem('repoOwner') || 'pratyanch-github');
  const [repo, setRepo] = useState<string>(() => localStorage.getItem('repoName') || 'Obsidian');

  useEffect(() => {
    localStorage.setItem('repoOwner', owner);
    localStorage.setItem('repoName', repo);
  }, [owner, repo]);

  const setRepoCallback = (newOwner: string, newRepo: string) => {
    setOwner(newOwner);
    setRepo(newRepo);
  };

  const value = useMemo(() => ({ owner, repo, setRepo: setRepoCallback }), [owner, repo]);

  return (
    <RepoContext.Provider value={value}>
      {children}
    </RepoContext.Provider>
  );
};
