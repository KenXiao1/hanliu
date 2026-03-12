import { LazyGiscusComments } from "@/components/site/lazy-giscus";

export function DiscussionView({ threadId }: { threadId: string }) {
  return (
    <div className="discussion-section">
      <header className="page-banner">
        <p className="eyebrow">整集讨论</p>
        <h1>第一集评论区</h1>
        <p>在此讨论这一集的内容。</p>
      </header>
      <LazyGiscusComments threadId={threadId} />
    </div>
  );
}
