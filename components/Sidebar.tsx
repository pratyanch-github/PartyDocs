
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { GitHubContent } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { RepoContext } from '../context/RepoContext';
import { SidebarContext } from '../context/SidebarContext';
import { ListSkeleton } from './skeletons/ListSkeleton';
import { githubApiFetch } from '../utils/github';

interface DirectoryViewProps {
  path: string;
  activePath: string;
  level: number;
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ path, activePath, level }) => {
  const { owner, repo } = useContext(RepoContext);
  const [contents, setContents] = useState<GitHubContent[]>([]);
  const [isOpen, setIsOpen] = useState(level === 0 || activePath.startsWith(path + '/'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { closeSidebar } = useContext(SidebarContext);

  const fetchContents = useCallback(async () => {
    if (!owner || !repo) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await githubApiFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
      if (!res.ok) throw new Error('Failed to fetch directory contents.');
      const data: GitHubContent[] = (await res.json()).filter((item: any) => item.name !== '.blog' && item.name !== 'blog');
      data.sort((a, b) => {
        if (a.type === 'dir' && b.type !== 'dir') return -1;
        if (a.type !== 'dir' && b.type === 'dir') return 1;
        return a.name.localeCompare(b.name);
      });
      setContents(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [owner, repo, path]);
  
  useEffect(() => {
    if (level === 0 || (isOpen && contents.length === 0)) {
      fetchContents();
    }
  }, [owner, repo, isOpen, level, fetchContents]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  }

  const linkClasses = (isActive: boolean) =>
    `block rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  const files = contents.filter(item => item.type === 'file' && (item.name.endsWith('.md') || item.name.endsWith('.mdx')));
  const directories = contents.filter(item => item.type === 'dir');

  const content = (
    <div
        className={`transition-all duration-300 ease-in-out grid ${
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
    >
        <div className="overflow-hidden">
            <ul className={`space-y-1 ${level > 0 ? 'pl-4 border-l border-gray-200 dark:border-gray-700 ml-3 mt-2' : ''}`}>
                {isLoading ? <ListSkeleton /> : null}
                {error ? <li className="px-3 py-2 text-sm text-red-500">Error loading.</li> : null}
                {directories.map(dir => (
                    <li key={dir.sha}>
                        <DirectoryView path={dir.path} activePath={activePath} level={level + 1} />
                    </li>
                ))}
                {files.map(item => (
                    <li key={item.sha}>
                        <NavLink
                            to={`/docs/${item.path}`}
                            onClick={closeSidebar}
                            className={({ isActive }) => linkClasses(isActive)}
                        >
                            {item.name.replace(/\.mdx?$/, '')}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );

  if (level === 0) {
      return <nav className="space-y-4">{content}</nav>;
  }

  return (
    <div>
        <button
            onClick={handleToggle}
            className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            aria-expanded={isOpen}
        >
            <span className="capitalize">{path.split('/').pop()?.replace(/[-_]/g, ' ')}</span>
            <ChevronRightIcon
                className={`transform transition-transform duration-200 ease-in-out ${
                    isOpen ? 'rotate-90' : 'rotate-0'
                }`}
            />
        </button>
        {content}
    </div>
  );
}

const SidebarContent: React.FC<{ activePath: string }> = ({ activePath }) => {
    return (
        <div className="h-full overflow-y-auto py-8 pr-4">
            <DirectoryView path="" activePath={activePath} level={0} />
        </div>
    );
};

const Sidebar: React.FC<{ activePath: string }> = ({ activePath }) => {
  const { isOpen, closeSidebar } = useContext(SidebarContext);
  const [width, setWidth] = useState(() => parseInt(localStorage.getItem('sidebarWidth') || '288', 10)); // 288px is w-72
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);
  
  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'auto';
    document.body.style.userSelect = 'auto';
  }, []);
  
  const handleResize = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = e.clientX - (sidebarRef.current?.getBoundingClientRect().left || 0);
      setWidth(Math.max(220, Math.min(newWidth, 500))); // Clamp width
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [handleResize, stopResizing]);

  useEffect(() => {
      localStorage.setItem('sidebarWidth', width.toString());
  }, [width]);

  return (
    <>
      {/* Mobile Sidebar (Overlay) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="fixed inset-0 bg-black/30" onClick={closeSidebar}></div>
        <aside className="relative z-10 w-72 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
            <SidebarContent activePath={activePath} />
        </aside>
      </div>

      {/* Desktop Sidebar (Resizable) */}
      <aside 
        ref={sidebarRef}
        className="hidden lg:flex flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)]"
        style={{ width: `${width}px` }}
      >
        <div className="flex-grow h-full border-r border-gray-200 dark:border-gray-800">
          <SidebarContent activePath={activePath} />
        </div>
        <div 
          className="w-2 h-full cursor-col-resize flex-shrink-0 group"
          onMouseDown={startResizing}
        >
            <div className="w-0.5 h-full bg-transparent group-hover:bg-indigo-400 mx-auto"></div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
