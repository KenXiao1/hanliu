import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PreferenceSync } from "@/components/site/preference-sync";
import { StandaloneStoryView } from "@/components/site/standalone-story-view";
import { getStandaloneStory } from "@/lib/content/stories";
import { parsePreferences } from "@/lib/preferences";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStandaloneStory(slug);

  if (!story) {
    return {};
  }

  return {
    title: story.titleHans,
    description: story.summaryHans,
    openGraph: {
      title: story.titleHans,
      description: story.summaryHans,
      type: "article"
    }
  };
}

export default async function StoryPage({ params, searchParams }: StoryPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const preferences = parsePreferences(resolvedSearchParams);
  const story = await getStandaloneStory(slug);

  if (!story) {
    notFound();
  }

  return (
    <PreferenceSync preferences={preferences}>
      <StandaloneStoryView story={story} preferences={preferences} />
    </PreferenceSync>
  );
}
