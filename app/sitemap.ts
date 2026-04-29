import type { MetadataRoute } from 'next';
import { getAllArticles, getAllRules, getAllSetPieces, getAllPositions, getRestartData, getAllPhases, getAllScoring, getAllGameplay } from '@/lib/mdx';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raizo-rugby-lab.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, rules, setPieces, positions, restartData, phases, scoring, gameplay] = await Promise.all([
    getAllArticles(),
    getAllRules(),
    getAllSetPieces(),
    getAllPositions(),
    getRestartData(),
    getAllPhases(),
    getAllScoring(),
    getAllGameplay(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/rules`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/positions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.id}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const rulePages: MetadataRoute.Sitemap = rules.map((r) => ({
    url: `${BASE_URL}/rules/${r.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const setPiecePages: MetadataRoute.Sitemap = setPieces.map((s) => ({
    url: `${BASE_URL}/rules/setpiece-${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const positionPages: MetadataRoute.Sitemap = positions.map((p) => ({
    url: `${BASE_URL}/positions/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const restartPages: MetadataRoute.Sitemap = restartData.items.map((r) => ({
    url: `${BASE_URL}/rules/restart-${r.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const phasePages: MetadataRoute.Sitemap = phases.map((p) => ({
    url: `${BASE_URL}/rules/phase-${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const scoringPages: MetadataRoute.Sitemap = scoring.map((s) => ({
    url: `${BASE_URL}/rules/scoring-${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const gameplayPages: MetadataRoute.Sitemap = gameplay.map((g) => ({
    url: `${BASE_URL}/rules/gameplay-${g.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...rulePages, ...setPiecePages, ...restartPages, ...phasePages, ...scoringPages, ...gameplayPages, ...positionPages];
}
