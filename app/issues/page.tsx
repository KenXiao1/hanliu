import { SeriesHome } from "@/components/site/series-home";
import { getAllIssues } from "@/lib/content/repository";

export default async function IssuesIndexPage() {
  const issues = await getAllIssues();

  return <SeriesHome issues={issues} />;
}
