
import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon } from './icons/LogoIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Docs</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/docs" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Community</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="https://www.linkedin.com/in/pratyanch" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Discord</a></li>
              <li><a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">More</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/blog" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</Link></li>
              <li><a href="https://github.com/pratyanch-github" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">GitHub</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
             <div className="flex items-center space-x-2">
              <LogoIcon className="h-8 w-auto text-indigo-600" />
              <span className="font-bold text-lg text-gray-800 dark:text-white">PratyDOC</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-base text-gray-400">
          <p>Copyright © {new Date().getFullYear()} Pratyanch. Built with React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;