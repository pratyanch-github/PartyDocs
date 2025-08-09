
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { RepoContext } from '../context/RepoContext';
import { GitHubContent } from '../types';
import { BlogCardSkeleton } from '../components/skeletons/BlogCardSkeleton';
import { githubApiFetch } from '../utils/github';

const BlogCard: React.FC<{ post: GitHubContent }> = ({ post }) => {
    const slug = post.name.replace(/\.mdx?$/, '');
    const title = slug.replace(/[-_]/g, ' ');

    return (
      <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col transition-all hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700">
        <h2 className="text-2xl font-bold mb-2 capitalize">
          <Link to={`/blog/${slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {title}
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          Click to read this post. More metadata could be extracted from the file's frontmatter.
        </p>
        <Link to={`/blog/${slug}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline self-start">
          Read More &rarr;
        </Link>
      </article>
    );
}

const BlogListPage: React.FC = () => {
    const { owner, repo } = useContext(RepoContext);
    const [posts, setPosts] = useState<GitHubContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!owner || !repo) return;

        const fetchBlogPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await githubApiFetch(`https://api.github.com/repos/${owner}/${repo}/contents/blog`);
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("No 'blog' directory found in this repository.");
                    }
                    throw new Error('Failed to fetch blog posts.');
                }
                const data: GitHubContent[] = await res.json();
                const markdownPosts = data.filter(item => item.type === 'file' && (item.name.endsWith('.md') || item.name.endsWith('.mdx')));
                setPosts(markdownPosts);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, [owner, repo]);


  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Recent posts from the repository.</p>
      </div>
       {error && <div className="text-center text-red-500">{error}</div>}
       {!loading && !error && posts.length === 0 && <div className="text-center">No blog posts found in the <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">/blog</code> directory.</div>}
      <div className="space-y-12">
        {loading ? (
            <>
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
            </>
        ) : (
            posts.map(post => (
              <BlogCard key={post.sha} post={post} />
            ))
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
