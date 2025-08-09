
export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  authorImage: string;
  date: string;
  tags: string[];
  content: string;
  excerpt: string;
}

export interface TocEntry {
  level: number;
  text: string;
  id: string;
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  _links: {
    self: string;
    git: string;
    html: string;
  };
}
