
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { CodeBlock } from '../components/CodeBlock';
import { useTableOfContents } from '../hooks/useTableOfContents';
import { RepoContext } from '../context/RepoContext';
import { GitHubContent } from '../types';
import { DocSkeleton } from '../components/skeletons/DocSkeleton';
import { githubApiFetch } from '../utils/github';

const DocPage: React.FC = () => {
  const params = useParams<{ "*": string }>();
  const path = params['*'];
  const { owner, repo } = useContext(RepoContext);
  
  const [doc, setDoc] = useState<{ content: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const toc = useTableOfContents(doc?.content || '');

  useEffect(() => {
    if (!path || !owner || !repo) return;
    
    setLoading(true);
    setError(null);
    setDoc(null);

    const fetchDocContent = async () => {
      try {
        const metaRes = await githubApiFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        if (!metaRes.ok) throw new Error('File not found in repository.');
        
        const fileMeta = await metaRes.json() as GitHubContent;

        if (fileMeta.type !== 'file' || !fileMeta.download_url) {
            throw new Error('Path does not point to a valid file.');
        }

        const contentRes = await fetch(fileMeta.download_url);
        if (!contentRes.ok) throw new Error('Could not download file content.');
        
        const content = await contentRes.text();
        const title = fileMeta.name.replace(/\.mdx?$/, '').replace(/[-_]/g, ' ');

        setDoc({ content, title });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocContent();
  }, [path, owner, repo]);

  if (!owner || !repo) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="max-w-screen-2xl mx-auto flex">
      <Sidebar activePath={path || ''} />
      <div className="flex-grow min-w-0 pt-10 lg:px-8">
        {loading ? (
          <DocSkeleton />
        ) : error ? (
           <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : !doc ? (
          <div className="text-center py-10">Document not found.</div>
        ) : (
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="capitalize">{doc.title}</h1>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
              components={{
                code: CodeBlock,
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </article>
        )}
      </div>
      <RightSidebar toc={toc} />
    </div>
  );
};

export default DocPage;
