
import { useState, useEffect } from 'react';
import { TocEntry } from '../types';

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -

export const useTableOfContents = (markdownContent: string): TocEntry[] => {
  const [toc, setToc] = useState<TocEntry[]>([]);

  useEffect(() => {
    if (!markdownContent) {
      setToc([]);
      return;
    }

    const headingRegex = /^(##|###)\s(.+)/gm;
    const matches = Array.from(markdownContent.matchAll(headingRegex));
    
    const newToc: TocEntry[] = matches.map(match => {
      const level = match[1].length; // level is 2 for ##, 3 for ###
      const text = match[2].trim();
      const id = slugify(text);
      return { level, text, id };
    });

    // Add unique suffixes to duplicate IDs
    const idCounts: Record<string, number> = {};
    const uniqueToc = newToc.map(entry => {
        idCounts[entry.id] = (idCounts[entry.id] || 0) + 1;
        if(idCounts[entry.id] > 1) {
            return { ...entry, id: `${entry.id}-${idCounts[entry.id]-1}`};
        }
        return entry;
    });

    setToc(uniqueToc);

  }, [markdownContent]);

  return toc;
};