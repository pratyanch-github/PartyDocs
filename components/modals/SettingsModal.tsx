
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RepoContext } from '../../context/RepoContext';
import { ModalContext } from '../../context/ModalContext';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { githubApiFetch } from '../../utils/github';

const SettingsModal: React.FC = () => {
    const { isSettingsModalOpen, closeSettingsModal } = useContext(ModalContext);
    const { owner, repo, setRepo } = useContext(RepoContext);
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passkey, setPasskey] = useState('');
    const [passkeyError, setPasskeyError] = useState('');

    const [repoUrl, setRepoUrl] = useState(`https://github.com/${owner}/${repo}`);
    const [repoError, setRepoError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isSettingsModalOpen) {
            setRepoUrl(`https://github.com/${owner}/${repo}`);
            // Reset state on open
            setIsAuthenticated(false);
            setPasskey('');
            setPasskeyError('');
            setRepoError('');
        }
    }, [isSettingsModalOpen, owner, repo]);

    const handlePasskeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passkey === 'PratyanchIsGod') {
            setIsAuthenticated(true);
            setPasskeyError('');
        } else {
            setPasskeyError('Incorrect passkey.');
        }
    };
    
    const handleRepoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRepoError('');
        setIsLoading(true);
        try {
            const url = new URL(repoUrl);
            if (url.hostname !== 'github.com') {
                throw new Error('Please enter a valid GitHub URL.');
            }
            const pathParts = url.pathname.split('/').filter(Boolean);
            if (pathParts.length < 2) {
                throw new Error('URL must be in the format github.com/owner/repo.');
            }
            const [newOwner, newRepo] = pathParts;
            
            githubApiFetch(`https://api.github.com/repos/${newOwner}/${newRepo}`)
              .then(res => {
                if (!res.ok) {
                  throw new Error('Repository not found or is private. Please check the URL.');
                }
                setRepo(newOwner, newRepo);
                closeSettingsModal();
                navigate('/docs');
              })
              .catch(err => {
                 setRepoError(err.message || 'Failed to fetch repository.');
              })
              .finally(() => {
                setIsLoading(false);
              });

        } catch (err) {
            setRepoError((err as Error).message);
            setIsLoading(false);
        }
    };

    if (!isSettingsModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0"
                onClick={closeSettingsModal}
            ></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in-up">
                <button 
                    onClick={closeSettingsModal}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >&times;</button>
                
                {!isAuthenticated ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Enter Passkey</h2>
                        <form onSubmit={handlePasskeySubmit}>
                            <input
                                type="password"
                                value={passkey}
                                onChange={(e) => setPasskey(e.target.value)}
                                placeholder="Passkey"
                                className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                aria-label="Passkey"
                            />
                            {passkeyError && <p className="mt-2 text-red-500 text-sm">{passkeyError}</p>}
                             <button 
                                type="submit" 
                                className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                Authenticate
                              </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Change Repository</h2>
                        <form onSubmit={handleRepoSubmit}>
                            <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Repository URL</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                id="repo-url"
                                type="text"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                placeholder="https://github.com/owner/repo"
                                className="flex-grow w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                aria-label="GitHub Repository URL"
                              />
                              <button 
                                type="submit" 
                                className="inline-flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                                disabled={isLoading}
                              >
                                {isLoading ? <SpinnerIcon /> : 'Load'}
                              </button>
                            </div>
                            {repoError && <p className="mt-2 text-red-500 text-sm">{repoError}</p>}
                        </form>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SettingsModal;
