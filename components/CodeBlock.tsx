
import React, { useContext } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ThemeContext } from '../App';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  if (inline) {
    return <code className={className}>{children}</code>;
  }

  return !inline && match ? (
    <SyntaxHighlighter
      style={isDarkMode ? atomDark : coy}
      language={match[1]}
      PreTag="div"
    >
      {codeString}
    </SyntaxHighlighter>
  ) : (
    <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded font-mono text-sm">
      {children}
    </code>
  );
};
