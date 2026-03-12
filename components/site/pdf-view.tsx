"use client";

import Link from "next/link";

import { useReaderPreferences } from "@/components/site/preference-sync";
import { buildIssuePdfAssetPath } from "@/lib/content/pdf";

export function PdfView({
  issueId,
  issueTitle
}: {
  issueId: string;
  issueTitle: string;
}) {
  const { preferences } = useReaderPreferences();
  const pdfSrc = buildIssuePdfAssetPath(issueId, preferences.script);

  return (
    <section className="pdf-reader">
      <div className="page-banner pdf-banner">
        <p className="eyebrow">PDF 在线阅读</p>
        <h1>{issueTitle}</h1>
        <p>直接加载原始 PDF，进入后即可连续滑动阅读。</p>
        <Link href={pdfSrc} className="hero-link" target="_blank" rel="noreferrer">
          新窗口打开
        </Link>
      </div>

      <div className="pdf-stage">
        <iframe
          key={preferences.script}
          title={`${issueTitle} PDF 在线阅读`}
          src={pdfSrc}
          className="pdf-frame"
          loading="eager"
        />
      </div>
    </section>
  );
}
