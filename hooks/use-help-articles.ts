"use client";

import { useEffect, useState } from "react";

export type HelpArticle = {
  id: string;
  title: string;
  type: string;
};

/** Help articles for the ticket sidebar. */
export function useHelpArticles(): HelpArticle[] {
  const [articles, setArticles] = useState<HelpArticle[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/help-articles")
      .then((response) => response.json())
      .then((data: { articles?: HelpArticle[] }) => {
        if (active) setArticles(data.articles ?? []);
      })
      .catch(() => {
        // Leave the list empty if the request fails.
      });
    return () => {
      active = false;
    };
  }, []);

  return articles;
}
