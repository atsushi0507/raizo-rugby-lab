import { getAllArticles, getAllRules, getAllPositions, getAllGallery, getRestartData, getAllPhases, getAllScoring, getAllGameplay } from './mdx';
import type { ArticleFrontmatter, RuleData, PositionFrontmatter, GalleryFrontmatter, RestartItem, PhaseData, ScoringData, GameplayData } from './mdx';

export interface NewsItem {
  id: string;
  title: string;
  href: string;
  category: '記事' | 'ルール' | 'ポジション' | 'ギャラリー' | '再開方法' | 'プレーの流れ' | '得点方法' | '試合の進め方';
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
  isUpdated: boolean;
}

const THREE_DAYS_MS = 72 * 60 * 60 * 1000;

function isWithin72Hours(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < THREE_DAYS_MS;
}

function toNewsItem(
  id: string,
  title: string,
  href: string,
  category: NewsItem['category'],
  createdAt?: string,
  updatedAt?: string,
): NewsItem | null {
  if (!createdAt) return null;
  const ua = updatedAt ?? createdAt;
  return {
    id,
    title,
    href,
    category,
    createdAt,
    updatedAt: ua,
    isNew: isWithin72Hours(createdAt),
    isUpdated: ua !== createdAt,
  };
}

type WithFeatured = { isFeatured?: boolean; createdAt?: string; updatedAt?: string };

export async function getFeaturedNews(): Promise<NewsItem[]> {
  const [articles, rules, positions, galleries, restartData, phases, scoring, gameplay] = await Promise.all([
    getAllArticles(),
    getAllRules(),
    getAllPositions(),
    getAllGallery(),
    getRestartData(),
    getAllPhases(),
    getAllScoring(),
    getAllGameplay(),
  ]);

  const items: NewsItem[] = [];

  // Articles
  for (const a of articles as (ArticleFrontmatter & WithFeatured)[]) {
    if (!a.isFeatured) continue;
    const item = toNewsItem(a.id, a.title, `/articles/${a.id}`, '記事', a.createdAt, a.updatedAt);
    if (item) items.push(item);
  }

  // Rules
  for (const r of rules as (RuleData & WithFeatured)[]) {
    if (!r.isFeatured) continue;
    const item = toNewsItem(r.id, r.title, `/rules/${r.id}`, 'ルール', r.createdAt, r.updatedAt);
    if (item) items.push(item);
  }

  // Positions
  for (const p of positions as (PositionFrontmatter & WithFeatured)[]) {
    if (!p.isFeatured) continue;
    const item = toNewsItem(p.id, p.name, `/positions/${p.id}`, 'ポジション', p.createdAt, p.updatedAt);
    if (item) items.push(item);
  }

  // Gallery
  for (const g of galleries as (GalleryFrontmatter & WithFeatured)[]) {
    if (!g.isFeatured) continue;
    const item = toNewsItem(g.id, g.title, `/gallery`, 'ギャラリー', g.createdAt, g.updatedAt);
    if (item) items.push(item);
  }

  // Restarts
  for (const r of restartData.items as (RestartItem & WithFeatured)[]) {
    if (!r.isFeatured) continue;
    const item = toNewsItem(r.id, r.title, `/rules/restart-${r.id}`, '再開方法', r.createdAt, r.updatedAt);
    if (item) items.push(item);
  }

  // Phases
  for (const p of phases as (PhaseData & WithFeatured)[]) {
    if (!p.isFeatured) continue;
    const item = toNewsItem(p.id, p.title, `/rules/phase-${p.id}`, 'プレーの流れ', p.createdAt, p.updatedAt);
    if (item) items.push(item);
  }

  // Scoring
  for (const s of scoring as (ScoringData & WithFeatured)[]) {
    if (!s.isFeatured) continue;
    const item = toNewsItem(s.id, s.title, `/rules/scoring-${s.id}`, '得点方法', s.createdAt, s.updatedAt);
    if (item) items.push(item);
  }

  // Gameplay
  for (const g of gameplay as (GameplayData & WithFeatured)[]) {
    if (!g.isFeatured) continue;
    const item = toNewsItem(g.id, g.title, `/rules/gameplay-${g.id}`, '試合の進め方', g.createdAt, g.updatedAt);
    if (item) items.push(item);
  }

  // Sort: updatedAt descending (updated items use updatedAt, others use createdAt)
  items.sort((a, b) => {
    const dateA = a.isUpdated ? a.updatedAt : a.createdAt;
    const dateB = b.isUpdated ? b.updatedAt : b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return items;
}
