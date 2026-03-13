import path from "node:path";
import { promises as fs } from "node:fs";

import { cache } from "react";

import type { LocaleCode } from "@/lib/content/types";

export type StandaloneStorySummary = {
  slug: string;
  titleHans: string;
  titleHant: string;
  summaryHans: string;
  summaryHant: string;
};

export type StandaloneStoryLocale = {
  title: string;
  markdown: string;
  sourcePath: string;
  sourceUrl?: string;
};

export type StandaloneStory = StandaloneStorySummary & {
  locales: Record<LocaleCode, StandaloneStoryLocale>;
};

const storyDefinitions = [
  {
    slug: "hanliu-founding-story",
    titleHans: "《汉留》创刊故事",
    titleHant: "《漢留》創刊故事",
    summaryHans: "胡又天谈《汉留》的缘起、定位、征稿与发行方式。",
    summaryHant: "胡又天談《漢留》的緣起、定位、徵稿與發行方式。",
    files: {
      "zh-Hans": "《汉留》创刊故事简体版-胡又天的文章.md",
      "zh-Hant": "《汉留》创刊故事繁体版.md"
    }
  }
] as const;

export async function getStandaloneStories(): Promise<StandaloneStorySummary[]> {
  return storyDefinitions.map((story) => ({
    slug: story.slug,
    titleHans: story.titleHans,
    titleHant: story.titleHant,
    summaryHans: story.summaryHans,
    summaryHant: story.summaryHant
  }));
}

export const getStandaloneStory = cache(async (slug: string): Promise<StandaloneStory | null> => {
  const story = storyDefinitions.find((entry) => entry.slug === slug);
  if (!story) {
    return null;
  }

  const [hans, hant] = await Promise.all([
    readStoryLocale(story.files["zh-Hans"]),
    readStoryLocale(story.files["zh-Hant"])
  ]);

  return {
    slug: story.slug,
    titleHans: story.titleHans,
    titleHant: story.titleHant,
    summaryHans: story.summaryHans,
    summaryHant: story.summaryHant,
    locales: {
      "zh-Hans": hans,
      "zh-Hant": hant
    }
  };
});

async function readStoryLocale(relativePath: string): Promise<StandaloneStoryLocale> {
  const sourcePath = path.join(process.cwd(), relativePath);
  const raw = await fs.readFile(sourcePath, "utf8");
  const { frontmatter, body } = splitFrontmatter(raw);

  return {
    title: extractFirstHeading(body) ?? relativePath,
    markdown: body.trim(),
    sourcePath: relativePath,
    sourceUrl: frontmatter["zhihu-link"]
  };
}

function splitFrontmatter(raw: string) {
  if (!raw.startsWith("---")) {
    return {
      frontmatter: {} as Record<string, string>,
      body: raw
    };
  }

  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const closingIndex = lines.slice(1).findIndex((line) => line.trim() === "---");

  if (closingIndex === -1) {
    return {
      frontmatter: {} as Record<string, string>,
      body: raw
    };
  }

  const frontmatterLines = lines.slice(1, closingIndex + 1);
  const bodyLines = lines.slice(closingIndex + 2);

  const frontmatter = frontmatterLines.reduce<Record<string, string>>((result, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return result;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key) {
      result[key] = value;
    }
    return result;
  }, {});

  return {
    frontmatter,
    body: bodyLines.join("\n")
  };
}

function extractFirstHeading(markdown: string) {
  const line = markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .find((entry) => /^#{1,6}\s+/.test(entry.trim()));

  return line ? line.replace(/^#{1,6}\s+/, "").trim() : null;
}
