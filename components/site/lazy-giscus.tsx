"use client";

import dynamic from "next/dynamic";

const GiscusComments = dynamic(() => import("@/components/site/giscus-comments").then((mod) => mod.GiscusComments), {
  ssr: false,
  loading: () => (
    <div className="comment-placeholder">
      <p>评论区加载中…</p>
    </div>
  )
});

export function LazyGiscusComments({ threadId }: { threadId: string }) {
  return <GiscusComments threadId={threadId} />;
}
