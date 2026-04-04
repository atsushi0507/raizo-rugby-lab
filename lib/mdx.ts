import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface ArticleFrontmatter {
  id: string;
  title: string;
  category: '解説' | '分析';
  tags: string[];
  thumbnail: string;
  excerpt: string;
  date: string; // ISO 8601
  readTime: string;
  level: '初級' | '中級' | '上級';
  team?: string;
  position?: string;
  season?: string;
  videoUrl?: string;
}

export interface PositionFrontmatter {
  id: string;
  number: string;
  name: string;
  nameEn: string;
  category: 'フォワード' | 'バックス';
  description: string;
  role: string[];
  requiredSkills: string[];
  icon: string;
  character: string;
}

export interface GalleryFrontmatter {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  match: string;
  date: string;
  photoCount: number;
}

export type ContentFrontmatter =
  | ArticleFrontmatter
  | PositionFrontmatter
  | GalleryFrontmatter;

// ─── Validation Helpers ───────────────────────────────────────────────────────

function assertString(
  data: Record<string, unknown>,
  field: string,
  filePath: string
): string {
  const value = data[field];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `MDX parse error in "${filePath}": field "${field}" must be a non-empty string (got ${JSON.stringify(value)})`
    );
  }
  return value;
}

function assertStringArray(
  data: Record<string, unknown>,
  field: string,
  filePath: string
): string[] {
  const value = data[field];
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== 'string')
  ) {
    throw new Error(
      `MDX parse error in "${filePath}": field "${field}" must be an array of strings (got ${JSON.stringify(value)})`
    );
  }
  return value as string[];
}

function assertNumber(
  data: Record<string, unknown>,
  field: string,
  filePath: string
): number {
  const value = data[field];
  if (typeof value !== 'number') {
    throw new Error(
      `MDX parse error in "${filePath}": field "${field}" must be a number (got ${JSON.stringify(value)})`
    );
  }
  return value;
}

function assertOneOf<T extends string>(
  data: Record<string, unknown>,
  field: string,
  allowed: readonly T[],
  filePath: string
): T {
  const value = data[field];
  if (!allowed.includes(value as T)) {
    throw new Error(
      `MDX parse error in "${filePath}": field "${field}" must be one of ${JSON.stringify(allowed)} (got ${JSON.stringify(value)})`
    );
  }
  return value as T;
}

// ─── Frontmatter Validators ───────────────────────────────────────────────────

export function validateArticleFrontmatter(
  data: Record<string, unknown>,
  filePath: string
): ArticleFrontmatter {
  return {
    id: assertString(data, 'id', filePath),
    title: assertString(data, 'title', filePath),
    category: assertOneOf(data, 'category', ['解説', '分析'] as const, filePath),
    tags: assertStringArray(data, 'tags', filePath),
    thumbnail: assertString(data, 'thumbnail', filePath),
    excerpt: assertString(data, 'excerpt', filePath),
    date: assertString(data, 'date', filePath),
    readTime: assertString(data, 'readTime', filePath),
    level: assertOneOf(data, 'level', ['初級', '中級', '上級'] as const, filePath),
    ...(data.team !== undefined && { team: assertString(data, 'team', filePath) }),
    ...(data.position !== undefined && { position: assertString(data, 'position', filePath) }),
    ...(data.season !== undefined && { season: assertString(data, 'season', filePath) }),
    ...(data.videoUrl !== undefined && { videoUrl: assertString(data, 'videoUrl', filePath) }),
  };
}

function validatePositionFrontmatter(
  data: Record<string, unknown>,
  filePath: string
): PositionFrontmatter {
  return {
    id: assertString(data, 'id', filePath),
    number: assertString(data, 'number', filePath),
    name: assertString(data, 'name', filePath),
    nameEn: assertString(data, 'nameEn', filePath),
    category: assertOneOf(data, 'category', ['フォワード', 'バックス'] as const, filePath),
    description: assertString(data, 'description', filePath),
    role: assertStringArray(data, 'role', filePath),
    requiredSkills: assertStringArray(data, 'requiredSkills', filePath),
    icon: assertString(data, 'icon', filePath),
    character: assertString(data, 'character', filePath),
  };
}

function validateGalleryFrontmatter(
  data: Record<string, unknown>,
  filePath: string
): GalleryFrontmatter {
  return {
    id: assertString(data, 'id', filePath),
    title: assertString(data, 'title', filePath),
    description: assertString(data, 'description', filePath),
    coverImage: assertString(data, 'coverImage', filePath),
    match: assertString(data, 'match', filePath),
    date: assertString(data, 'date', filePath),
    photoCount: assertNumber(data, 'photoCount', filePath),
  };
}

// ─── Directory Resolution ─────────────────────────────────────────────────────

function getDataDir(subDir: string): string {
  return path.join(process.cwd(), 'data', subDir);
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<ArticleFrontmatter[]> {
  const dir = getDataDir('articles');
  const files = getMdxFiles(dir);
  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return validateArticleFrontmatter(data as Record<string, unknown>, filePath);
  });
}

export async function getArticleById(
  id: string
): Promise<{ frontmatter: ArticleFrontmatter; content: string } | null> {
  const dir = getDataDir('articles');
  const files = getMdxFiles(dir);
  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const frontmatter = validateArticleFrontmatter(
      data as Record<string, unknown>,
      filePath
    );
    if (frontmatter.id === id) {
      return { frontmatter, content };
    }
  }
  return null;
}

export async function getAllPositions(): Promise<PositionFrontmatter[]> {
  const dir = getDataDir('positions');
  const files = getMdxFiles(dir);
  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return validatePositionFrontmatter(data as Record<string, unknown>, filePath);
  });
}

export async function getAllGallery(): Promise<GalleryFrontmatter[]> {
  const dir = getDataDir('gallery');
  const files = getMdxFiles(dir);
  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return validateGalleryFrontmatter(data as Record<string, unknown>, filePath);
  });
}
