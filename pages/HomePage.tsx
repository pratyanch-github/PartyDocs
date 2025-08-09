
import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{content}</p>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="text-center py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Welcome to PratyDOC
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Instantly create a beautiful documentation site from any public GitHub repository.
            The content from <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-sm">pratyanch-github/Obsidian</code> is currently being displayed.
          </p>
          <div className="mt-8">
             <Link
                to="/docs"
                className="inline-flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Explore Docs
              </Link>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Powered by GitHub"
              content="Directly renders your Markdown files from any public GitHub repository. No need to move your docs, just point PratyDOC to your repo."
            />
            <FeatureCard
              title="Live Updates"
              content="Changes pushed to your GitHub repository are reflected instantly. Your documentation is always up-to-date without any extra steps."
            />
            <FeatureCard
              title="Built with React"
              content="A fast, modern, and interactive experience for your users. The layout is fully customizable using the power of React."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;