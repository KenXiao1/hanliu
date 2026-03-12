"use client";

import Giscus from "@giscus/react";

import { useReaderPreferences } from "@/components/site/preference-sync";

export function GiscusComments({ threadId }: { threadId: string }) {
  const { preferences } = useReaderPreferences();
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="comment-placeholder">
        <p>评论区即将开放。</p>
      </div>
    );
  }

  return (
    <Giscus
      repo={repo as `${string}/${string}`}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping="specific"
      term={threadId}
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={preferences.theme}
      lang="zh-CN"
      loading="lazy"
    />
  );
}
