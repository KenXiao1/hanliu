import { GiscusComments } from "@/components/site/giscus-comments";

export function DiscussionView({ threadId }: { threadId: string }) {
  return (
    <div className="discussion-section">
      <header className="page-banner">
        <p className="eyebrow">整集讨论</p>
        <h1>第一集评论区</h1>
        <p>简体与繁体页面共用同一讨论串，便于把整集反馈沉淀在一起。</p>
      </header>
      <GiscusComments threadId={threadId} />
    </div>
  );
}
