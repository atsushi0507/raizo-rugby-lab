// Feature: rugby-media-nextjs, Property 1: MDX ファイル自動検出
// Validates: Requirements 2.1, 2.2

import { describe, test, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllArticles, getAllPositions, getAllGallery, validateArticleFrontmatter, type ArticleFrontmatter } from './mdx';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countMdxFiles(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).length;
}

// Minimal valid MDX content generators for each content type
function makeArticleMdx(id: string): string {
  return `---
id: "${id}"
title: "テスト記事 ${id}"
category: "解説"
tags: ["テスト"]
thumbnail: "https://example.com/img.jpg"
excerpt: "テスト用の抜粋"
date: "2026-01-01"
readTime: "3分"
level: "初級"
---

テスト本文
`;
}

function makePositionMdx(id: string): string {
  return `---
id: "${id}"
number: "${id}"
name: "テストポジション${id}"
nameEn: "Test Position ${id}"
category: "フォワード"
description: "テスト説明"
role:
  - "テスト役割"
requiredSkills:
  - "テストスキル"
icon: "/images/test.png"
character: "/images/test-char.png"
---

テスト本文
`;
}

function makeGalleryMdx(id: string): string {
  return `---
id: "${id}"
title: "テストギャラリー ${id}"
description: "テスト説明"
coverImage: "https://example.com/img.jpg"
match: "テスト vs テスト"
date: "2026-01-01"
photoCount: 1
---

テスト本文
`;
}

// ─── Temp file management ─────────────────────────────────────────────────────

const TEMP_FILES: string[] = [];

function writeTempMdx(dir: string, filename: string, content: string): void {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  TEMP_FILES.push(filePath);
}

afterEach(() => {
  // Clean up any temp files written during tests
  for (const f of TEMP_FILES.splice(0)) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
});

// ─── Property 1: MDX ファイル自動検出 ────────────────────────────────────────

describe('Property 1: MDX ファイル自動検出', () => {
  const articlesDir = path.join(process.cwd(), 'data', 'articles');
  const positionsDir = path.join(process.cwd(), 'data', 'positions');
  const galleryDir = path.join(process.cwd(), 'data', 'gallery');

  test('getAllArticles() returns count equal to .mdx file count in data/articles/', async () => {
    // Validates: Requirements 2.1, 2.2
    await fc.assert(
      fc.asyncProperty(
        // Generate 0–5 additional MDX files to add alongside existing ones
        fc.array(fc.nat({ max: 9999 }), { minLength: 0, maxLength: 5 }),
        async (extraIds) => {
          // Write extra temp MDX files
          const tempFilenames: string[] = [];
          for (const rawId of extraIds) {
            const id = `tmp-article-${rawId}`;
            const filename = `${id}.mdx`;
            // Avoid duplicate filenames within this run
            if (tempFilenames.includes(filename)) continue;
            tempFilenames.push(filename);
            writeTempMdx(articlesDir, filename, makeArticleMdx(id));
          }

          const expectedCount = countMdxFiles(articlesDir);
          const articles = await getAllArticles();
          return articles.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('getAllPositions() returns count equal to .mdx file count in data/positions/', async () => {
    // Validates: Requirements 2.1, 2.2
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.nat({ max: 9999 }), { minLength: 0, maxLength: 5 }),
        async (extraIds) => {
          const tempFilenames: string[] = [];
          for (const rawId of extraIds) {
            const id = `tmp-pos-${rawId}`;
            const filename = `${id}.mdx`;
            if (tempFilenames.includes(filename)) continue;
            tempFilenames.push(filename);
            writeTempMdx(positionsDir, filename, makePositionMdx(id));
          }

          const expectedCount = countMdxFiles(positionsDir);
          const positions = await getAllPositions();
          return positions.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('getAllGallery() returns count equal to .mdx file count in data/gallery/', async () => {
    // Validates: Requirements 2.1, 2.2
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.nat({ max: 9999 }), { minLength: 0, maxLength: 5 }),
        async (extraIds) => {
          const tempFilenames: string[] = [];
          for (const rawId of extraIds) {
            const id = `tmp-gallery-${rawId}`;
            const filename = `${id}.mdx`;
            if (tempFilenames.includes(filename)) continue;
            tempFilenames.push(filename);
            writeTempMdx(galleryDir, filename, makeGalleryMdx(id));
          }

          const expectedCount = countMdxFiles(galleryDir);
          const gallery = await getAllGallery();
          return gallery.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 2: フロントマターのラウンドトリップ ─────────────────────────────
// Feature: rugby-media-nextjs, Property 2: フロントマターのラウンドトリップ
// Validates: Requirements 2.3, 2.6

describe('Property 2: フロントマターのラウンドトリップ', () => {
  // Arbitrary for non-empty strings (printable ASCII, no YAML-breaking chars)
  const safeString = fc.stringMatching(/^[a-zA-Z0-9 _\-\.\/\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/).filter(s => s.trim().length > 0);

  // Arbitrary for ArticleFrontmatter
  const articleFrontmatterArb: fc.Arbitrary<ArticleFrontmatter> = fc.record({
    id: safeString,
    title: safeString,
    category: fc.constantFrom('解説' as const, '分析' as const),
    tags: fc.array(safeString, { minLength: 1, maxLength: 5 }),
    thumbnail: safeString,
    excerpt: safeString,
    date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
      .map(d => d.toISOString().slice(0, 10)),
    readTime: safeString,
    level: fc.constantFrom('初級' as const, '中級' as const, '上級' as const),
    team: fc.option(safeString, { nil: undefined }),
    position: fc.option(safeString, { nil: undefined }),
    season: fc.option(safeString, { nil: undefined }),
    videoUrl: fc.option(safeString, { nil: undefined }),
  }).map(fm => {
    // Remove undefined optional fields to match validateArticleFrontmatter behaviour
    const result: ArticleFrontmatter = {
      id: fm.id,
      title: fm.title,
      category: fm.category,
      tags: fm.tags,
      thumbnail: fm.thumbnail,
      excerpt: fm.excerpt,
      date: fm.date,
      readTime: fm.readTime,
      level: fm.level,
    };
    if (fm.team !== undefined) result.team = fm.team;
    if (fm.position !== undefined) result.position = fm.position;
    if (fm.season !== undefined) result.season = fm.season;
    if (fm.videoUrl !== undefined) result.videoUrl = fm.videoUrl;
    return result;
  });

  /**
   * Serialize an ArticleFrontmatter to a YAML frontmatter MDX string,
   * then parse it back with gray-matter and re-validate.
   */
  function serializeToMdx(fm: ArticleFrontmatter): string {
    const lines: string[] = ['---'];
    lines.push(`id: "${fm.id}"`);
    lines.push(`title: "${fm.title}"`);
    lines.push(`category: "${fm.category}"`);
    lines.push(`tags:`);
    for (const tag of fm.tags) lines.push(`  - "${tag}"`);
    lines.push(`thumbnail: "${fm.thumbnail}"`);
    lines.push(`excerpt: "${fm.excerpt}"`);
    lines.push(`date: "${fm.date}"`);
    lines.push(`readTime: "${fm.readTime}"`);
    lines.push(`level: "${fm.level}"`);
    if (fm.team !== undefined) lines.push(`team: "${fm.team}"`);
    if (fm.position !== undefined) lines.push(`position: "${fm.position}"`);
    if (fm.season !== undefined) lines.push(`season: "${fm.season}"`);
    if (fm.videoUrl !== undefined) lines.push(`videoUrl: "${fm.videoUrl}"`);
    lines.push('---');
    lines.push('');
    lines.push('本文');
    return lines.join('\n');
  }

  test('parsing → serializing → parsing produces an equivalent ArticleFrontmatter', () => {
    // Validates: Requirements 2.3, 2.6
    fc.assert(
      fc.property(articleFrontmatterArb, (original) => {
        const mdxString = serializeToMdx(original);
        const { data } = matter(mdxString);

        // Re-validate using the same logic as MDXLoader
        const parsed: ArticleFrontmatter = {
          id: data.id,
          title: data.title,
          category: data.category,
          tags: data.tags,
          thumbnail: data.thumbnail,
          excerpt: data.excerpt,
          date: data.date,
          readTime: data.readTime,
          level: data.level,
        };
        if (data.team !== undefined) parsed.team = data.team;
        if (data.position !== undefined) parsed.position = data.position;
        if (data.season !== undefined) parsed.season = data.season;
        if (data.videoUrl !== undefined) parsed.videoUrl = data.videoUrl;

        // Deep equality check
        expect(parsed).toEqual(original);
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 3: 無効フロントマターのエラー検出 ───────────────────────────────
// Feature: rugby-media-nextjs, Property 3: 無効フロントマターのエラー検出
// Validates: Requirements 2.5

describe('Property 3: 無効フロントマターのエラー検出', () => {
  // A complete valid data object to start from
  const validData: Record<string, unknown> = {
    id: 'test-id',
    title: 'テストタイトル',
    category: '解説',
    tags: ['タグ1'],
    thumbnail: 'https://example.com/img.jpg',
    excerpt: 'テスト抜粋',
    date: '2026-01-01',
    readTime: '5分',
    level: '初級',
  };

  // Per-field invalid value arbitraries.
  // Each entry guarantees the value will fail validation for that specific field.
  const invalidValuesByField: Record<string, fc.Arbitrary<unknown>> = {
    // String fields: invalid = missing, null, empty string, or non-string type
    id:        fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant(42), fc.constant(false)),
    title:     fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant(42), fc.constant([])),
    thumbnail: fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant(0)),
    excerpt:   fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant(true)),
    date:      fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant(20260101)),
    readTime:  fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant({})),
    // Enum fields: invalid = missing, null, or a string not in the allowed set
    category:  fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant('invalid'), fc.constant('article')),
    level:     fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant(''), fc.constant('beginner'), fc.constant('easy')),
    // Array field: invalid = missing, null, non-array, or array containing non-strings
    tags:      fc.oneof(fc.constant(undefined), fc.constant(null), fc.constant('tag'), fc.constant(42), fc.constant([1, 2, 3])),
  };

  const fieldNames = Object.keys(invalidValuesByField) as Array<keyof typeof invalidValuesByField>;

  test('validateArticleFrontmatter throws an error containing filePath and field name for any missing/invalid required field', () => {
    // Validates: Requirements 2.5
    fc.assert(
      fc.property(
        // Pick one required field to corrupt
        fc.constantFrom(...fieldNames),
        // Pick an arbitrary file path
        fc.stringMatching(/^\/[a-zA-Z0-9_\-\/]+\.mdx$/).filter(s => s.length > 5),
        (field, filePath) => {
          // Draw an invalid value for this specific field
          const invalidValue = fc.sample(invalidValuesByField[field], 1)[0];
          const data: Record<string, unknown> = { ...validData, [field]: invalidValue };

          let threw = false;
          let errorMessage = '';
          try {
            validateArticleFrontmatter(data, filePath);
          } catch (e) {
            threw = true;
            errorMessage = e instanceof Error ? e.message : String(e);
          }

          // Must throw
          if (!threw) return false;

          // Error message must contain the file path
          if (!errorMessage.includes(filePath)) return false;

          // Error message must contain the invalid field name
          if (!errorMessage.includes(field)) return false;

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
