import type { PageData, TextBlock } from "@/lib/content/types";

export type ArticleInlineNote = {
  text: string;
  marker?: string;
};

export type ArticleFootnote = {
  text: string;
  marker?: string;
};

export type ArticleBodyBlock = {
  text: string;
  trailingMarker?: string;
};

export type ArticlePageLayout = {
  pageNote?: ArticleInlineNote;
  bodyBlocks: ArticleBodyBlock[];
  bodyBlockYs: number[];
  footnotes: ArticleFootnote[];
};

export function buildArticlePageLayout(
  page: PageData,
  options?: {
    hiddenTitles?: string[];
    isArticleStartPage?: boolean;
  }
): ArticlePageLayout {
  const blocks = [...page.textBlocks].sort((left, right) => {
    if (left.y !== right.y) {
      return left.y - right.y;
    }

    return left.x - right.x;
  });

  const hiddenTitles = new Set((options?.hiddenTitles ?? []).map(normalizeComparableText).filter(Boolean));
  const bodyBlocks: Array<TextBlock & { text: string }> = [];
  const footnotes: ArticleFootnote[] = [];
  const extractedPageNote = options?.isArticleStartPage ? extractStartPageNote(blocks, page) : undefined;
  const extractedTitleBlockIndexes = options?.isArticleStartPage
    ? extractStartPageTitleBlockIndexes(blocks, page, options?.hiddenTitles?.[0])
    : [];
  const skippedBlockIndexes = new Set([...(extractedPageNote?.blockIndexes ?? []), ...extractedTitleBlockIndexes]);
  const pageNote: ArticleInlineNote | undefined = extractedPageNote?.note;

  for (const [index, block] of blocks.entries()) {
    if (skippedBlockIndexes.has(index)) {
      continue;
    }

    const text = block.text.trim();

    if (!text || isPdfPageNumber(block, page)) {
      continue;
    }

    if (isFootnoteBlock(block, page)) {
      footnotes.push(...splitFootnoteEntries(text));
      continue;
    }

    if (hiddenTitles.has(normalizeComparableText(text)) && isHeadingBlock(block, page)) {
      continue;
    }

    bodyBlocks.push({ ...block, text });
  }

  const normalizedBodyBlocks = normalizeBodyBlocks(bodyBlocks, footnotes);

  return {
    pageNote,
    bodyBlocks: normalizedBodyBlocks.map(({ text, trailingMarker }) => ({
      text,
      trailingMarker
    })),
    bodyBlockYs: normalizedBodyBlocks.map((block) => block.y),
    footnotes
  };
}

function extractStartPageNote(blocks: TextBlock[], page: PageData) {
  const candidates = blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => isTopRightPageNote(block, page));

  for (const candidate of candidates) {
    const lineGroup = candidates
      .filter(({ block }) => isSameLine(candidate.block, block))
      .sort((left, right) => left.block.x - right.block.x);
    const textBlocks = lineGroup.filter(({ block }) => !/^\d+$/.test(block.text.trim()));
    const markerBlocks = lineGroup.filter(({ block }) => /^\d+$/.test(block.text.trim()));

    if (textBlocks.length === 0) {
      continue;
    }

    const mergedText = textBlocks.map(({ block }) => block.text.trim()).join("");
    const splitNote = splitTrailingMarker(mergedText);
    const marker = splitNote.marker ?? markerBlocks[0]?.block.text.trim();

    return {
      note: {
        text: splitNote.text,
        marker
      },
      blockIndexes: lineGroup.map(({ index }) => index)
    };
  }

  return undefined;
}

function extractStartPageTitleBlockIndexes(blocks: TextBlock[], page: PageData, title: string | undefined) {
  const normalizedTitle = normalizeComparableText(title ?? "");

  if (!normalizedTitle) {
    return [];
  }

  const candidates = blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.y <= page.viewport.height * 0.4 && block.x <= page.viewport.width * 0.2 && isHeadingBlock(block, page));

  for (let startIndex = 0; startIndex < candidates.length; startIndex += 1) {
    let combinedTitle = "";
    const blockIndexes: number[] = [];

    for (let endIndex = startIndex; endIndex < candidates.length; endIndex += 1) {
      const candidate = candidates[endIndex];

      combinedTitle += normalizeComparableText(candidate.block.text);
      blockIndexes.push(candidate.index);

      if (combinedTitle === normalizedTitle) {
        return blockIndexes;
      }

      if (!normalizedTitle.startsWith(combinedTitle)) {
        break;
      }
    }
  }

  return [];
}

function isPdfPageNumber(block: TextBlock, page: PageData) {
  const text = block.text.trim();

  return /^\d+$/.test(text) && block.y >= page.viewport.height * 0.88 && block.x >= page.viewport.width * 0.35 && block.x <= page.viewport.width * 0.65;
}

function isFootnoteBlock(block: TextBlock, page: PageData) {
  const text = block.text.trim();
  const bottom = block.y + block.height;

  return /^\d+\s/.test(text) && block.y >= page.viewport.height * 0.6 && bottom >= page.viewport.height * 0.76;
}

function isTopRightPageNote(block: TextBlock, page: PageData) {
  const text = block.text.trim();

  return block.y <= page.viewport.height * 0.42 && block.x >= page.viewport.width * 0.68 && text.length <= 24;
}

function isHeadingBlock(block: TextBlock, page: PageData) {
  return block.height >= page.viewport.height * 0.028 && block.x <= page.viewport.width * 0.22;
}

function splitTrailingMarker(text: string): ArticleInlineNote {
  const match = text.match(/^(.*?)(\d+)$/);

  if (!match) {
    return { text };
  }

  return {
    text: match[1].trimEnd(),
    marker: match[2]
  };
}

function splitFootnoteEntries(text: string): ArticleFootnote[] {
  const matches = Array.from(text.matchAll(/(\d+)\s+/g))
    .map((match) => ({
      index: match.index ?? 0,
      marker: match[1],
      contentStart: (match.index ?? 0) + match[0].length
    }))
    .filter((match) => match.index === 0 || /[。！？；:：」》）】]\s*$/.test(text.slice(0, match.index)));

  if (!matches.length) {
    return [{ text }];
  }

  return matches
    .map((match, index) => {
      const nextMatch = matches[index + 1];
      const footnoteText = text.slice(match.contentStart, nextMatch?.index ?? text.length).trim();

      return {
        marker: match.marker,
        text: footnoteText
      };
    })
    .filter((footnote) => footnote.text);
}

function normalizeBodyBlocks(
  blocks: Array<TextBlock & { text: string }>,
  footnotes: ArticleFootnote[]
): Array<ArticleBodyBlock & { y: number }> {
  const footnoteMarkers = new Set(footnotes.map((footnote) => footnote.marker).filter((marker): marker is string => Boolean(marker)));
  const normalizedBlocks: Array<(ArticleBodyBlock & { x: number; y: number; width: number; height: number })> = [];
  let pendingTrailingMarker:
    | {
        marker: string;
        block: TextBlock;
      }
    | undefined;

  for (const [index, block] of blocks.entries()) {
    const standaloneMarker = getStandaloneFootnoteMarker(block, footnoteMarkers);

    if (standaloneMarker) {
      const previousBlock = normalizedBlocks.at(-1);
      const nextBlock = blocks[index + 1];

      if (previousBlock && (isSameLine(previousBlock, block) || isDetachedParagraphEndMarker(previousBlock, block, nextBlock))) {
        previousBlock.trailingMarker = standaloneMarker;
        continue;
      }

      if (nextBlock && shouldAttachMarkerToFollowingBlock(block, nextBlock)) {
        pendingTrailingMarker = {
          marker: standaloneMarker,
          block
        };
        continue;
      }
    }

    const previousBlock = normalizedBlocks.at(-1);
    const trailingMarker =
      pendingTrailingMarker && shouldAttachMarkerToFollowingBlock(pendingTrailingMarker.block, block)
        ? pendingTrailingMarker.marker
        : undefined;

    if (trailingMarker) {
      pendingTrailingMarker = undefined;
    }

    if (previousBlock && shouldMergeInlineSegments(previousBlock, block)) {
      previousBlock.text = `${previousBlock.text}${block.text}`;
      previousBlock.x = block.x;
      previousBlock.y = block.y;
      previousBlock.width = block.width;
      previousBlock.height = block.height;

      if (trailingMarker) {
        previousBlock.trailingMarker = trailingMarker;
      }

      continue;
    }

    if (previousBlock && shouldMergeWrappedLine(previousBlock, block)) {
      previousBlock.text = mergeWrappedText(previousBlock.text, block.text);
      previousBlock.x = block.x;
      previousBlock.y = block.y;
      previousBlock.width = block.width;
      previousBlock.height = block.height;

      if (trailingMarker) {
        previousBlock.trailingMarker = trailingMarker;
      }

      continue;
    }

    normalizedBlocks.push({
      text: block.text,
      trailingMarker,
      x: block.x,
      y: block.y,
      width: block.width,
      height: block.height
    });
  }

  return normalizedBlocks.map(({ text, trailingMarker, y }) => ({
    text,
    trailingMarker,
    y
  }));
}

function getStandaloneFootnoteMarker(block: TextBlock, footnoteMarkers: Set<string>) {
  const text = block.text.trim();

  if (!/^\d+$/.test(text) || text.length > 2) {
    return undefined;
  }

  const maxMarkerWidth = Math.max(block.height * 1.6, 14);

  if (block.width > maxMarkerWidth) {
    return undefined;
  }

  return footnoteMarkers.has(text) ? text : undefined;
}

function isSameLine(left: { y: number; height: number }, right: TextBlock) {
  return Math.abs(left.y - right.y) <= Math.max(left.height, right.height) * 0.8;
}

function isDetachedParagraphEndMarker(
  previousBlock: { text: string; x: number; y: number; height: number },
  markerBlock: TextBlock,
  nextBlock: TextBlock | undefined
) {
  const gapFromPrevious = markerBlock.y - previousBlock.y;
  const gapToNext = nextBlock ? nextBlock.y - markerBlock.y : Number.POSITIVE_INFINITY;
  const closeToPreviousLine = gapFromPrevious > 0 && gapFromPrevious <= Math.max(previousBlock.height, markerBlock.height) * 1.6;
  const fartherFromNextLine = gapToNext >= Math.max(markerBlock.height, nextBlock?.height ?? markerBlock.height) * 1.6;

  return closeToPreviousLine && fartherFromNextLine;
}

function shouldAttachMarkerToFollowingBlock(markerBlock: TextBlock, nextBlock: TextBlock) {
  const sameLine = isSameLine(markerBlock, nextBlock);
  const lineEndX = nextBlock.x + nextBlock.width;
  const maxGap = Math.max(markerBlock.width * 2, markerBlock.height, 12);
  const nearLineEnd = markerBlock.x >= lineEndX - maxGap && markerBlock.x <= lineEndX + maxGap;

  return sameLine && nearLineEnd;
}

function normalizeComparableText(text: string) {
  return splitTrailingMarker(text.trim()).text.trim();
}

function shouldMergeWrappedLine(
  previousBlock: { text: string; x: number; y: number; width: number; height: number },
  currentBlock: TextBlock
) {
  const verticalGap = currentBlock.y - previousBlock.y;
  const alignedToSameColumn = Math.abs(previousBlock.x - currentBlock.x) <= 2;
  const indentedWrappedContinuation = isIndentedWrappedContinuation(previousBlock, currentBlock);

  if (!alignedToSameColumn && !indentedWrappedContinuation) {
    return false;
  }

  if (/[。！？；:：]$/.test(previousBlock.text)) {
    return false;
  }

  return verticalGap > 0 && verticalGap <= Math.max(previousBlock.height, currentBlock.height) * 1.8;
}

function isIndentedWrappedContinuation(
  previousBlock: { x: number; height: number },
  currentBlock: TextBlock
) {
  const maxLineHeight = Math.max(previousBlock.height, currentBlock.height);
  const indentOffset = previousBlock.x - currentBlock.x;

  return indentOffset >= maxLineHeight * 0.6 && indentOffset <= maxLineHeight * 2.2;
}

function shouldMergeInlineSegments(
  previousBlock: { x: number; y: number; width: number; height: number },
  currentBlock: TextBlock
) {
  if (!isSameLine(previousBlock, currentBlock)) {
    return false;
  }

  const previousRight = previousBlock.x + previousBlock.width;
  const maxGap = Math.max(previousBlock.height, currentBlock.height) * 1.5;

  return currentBlock.x >= previousRight - 2 && currentBlock.x - previousRight <= maxGap;
}

function mergeWrappedText(left: string, right: string) {
  if (/[A-Za-z0-9]$/.test(left) && /^[A-Za-z0-9]/.test(right)) {
    return `${left} ${right}`;
  }

  return `${left}${right}`;
}
