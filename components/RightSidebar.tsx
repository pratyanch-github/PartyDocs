
import React, { useState, useEffect, useRef } from 'react';
import { TocEntry } from '../types';

interface RightSidebarProps {
  toc: TocEntry[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ toc }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      rootMargin: `0% 0% -80% 0%`,
      threshold: 1.0,
    });

    const elements = toc.map(entry => document.getElementById(entry.id)).filter(el => el);
    elements.forEach(el => observer.current?.observe(el!));

    return () => observer.current?.disconnect();
  }, [toc]);

  if (toc.length === 0) {
    return null;
  }
  
  const linkClasses = (id: string) => `block text-sm transition-colors ${
    activeId === id 
      ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
  }`;

  return (
    <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pl-8">
      <nav>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">On this page</h3>
        <ul className="space-y-2 border-l border-gray-200 dark:border-gray-700">
          {toc.map(entry => (
            <li key={entry.id}>
              <a 
                href={`#${entry.id}`}
                className={linkClasses(entry.id)}
                style={{ marginLeft: `${entry.level * 1}rem` }}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default RightSidebar;
