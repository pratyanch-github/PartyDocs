
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { CodeBlock } from '../components/CodeBlock';
import { RepoContext } from '../context/RepoContext';
import { GitHubContent } from '../types';
import { DocSkeleton } from '../components/skeletons/DocSkeleton';
import { githubApiFetch } from '../utils/github';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { owner, repo } = useContext(RepoContext);
  
  const [post, setPost] = useState<{ content: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !owner || !repo) return;

    const fetchPostContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let content = '';
        let found = false;
        
        const tryPath = async (ext: string) => {
            const path = `blog/${slug}${ext}`;
            const content_res = await githubApiFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
            if(content_res.ok) {
                const fileMeta = await content_res.json() as GitHubContent;
                if(fileMeta.download_url) {
                    const text_res = await fetch(fileMeta.download_url);
                    content = await text_res.text();
                    found = true;
                }
            }
        };

        await tryPath('.md');
        if (!found) await tryPath('.mdx');
        if (!found) throw new Error("Could not find blog post file (.md or .mdx).");
        
        const title = slug.replace(/[-_]/g, ' ');
        setPost({ content, title });

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostContent();
  }, [slug, owner, repo]);

  const renderContent = () => {
    if (loading) {
      return <DocSkeleton />;
    }

    if (error || !post) {
      return (
         <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Post not found.'}</p>
            <Link to="/blog" className="text-indigo-600 dark:text-indigo-400 hover:underline">&larr; Back to all posts</Link>
         </div>
      );
    }

    return (
      <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="capitalize">{post.title}</h1>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              code: CodeBlock,
            }}
          >
            {post.content}
          </ReactMarkdown>
      </article>
    );
  };


  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
       <header className="mb-8">
          <Link to="/blog" className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 block">&larr; Back to all posts</Link>
        </header>
        {renderContent()}
    </div>
  );
};

export default BlogPostPage;
