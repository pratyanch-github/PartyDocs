import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ThemeContext } from '../App';
import { SidebarContext } from '../context/SidebarContext';
import { ModalContext } from '../context/ModalContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { GithubIcon } from './icons/GithubIcon';
import { LogoIcon } from './icons/LogoIcon';
import { MenuIcon } from './icons/MenuIcon';
import { CogIcon } from './icons/CogIcon';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const { openSettingsModal } = useContext(ModalContext);
  const location = useLocation();

  const isDocPage = location.pathname.startsWith('/docs');

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold leading-6 ${
      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
    } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {isDocPage && (
              <button 
                onClick={toggleSidebar} 
                className="lg:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white"
                aria-label="Open sidebar"
              >
                <MenuIcon />
              </button>
            )}
            <NavLink to="/" className="flex items-center space-x-2">
              <LogoIcon className="h-8 w-auto text-indigo-600" />
              <span className="font-bold text-lg text-gray-800 dark:text-white">PratyDOC</span>
            </NavLink>
             <nav className="hidden md:flex items-center space-x-6 pl-4">
              <NavLink to="/docs" className={navLinkClasses}>
                Docs
              </NavLink>
              <NavLink to="/blog" className={navLinkClasses}>
                Blog
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <a href="https://github.com/pratyanch-github/Obsidian" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <GithubIcon />
            </a>
            <button
              onClick={openSettingsModal}
              className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open settings"
            >
              <CogIcon />
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;