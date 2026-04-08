import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface ConversationItem {
  speaker: string;
  message: string;
}

export interface StructureData {
  situation: string;
  situationImage?: string;
  decision: string;
  decisionImage?: string;
  result: string;
  resultImage?: string;
}

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

export interface ArticleData extends ArticleFrontmatter {
  introduction: string;
  conversations: ConversationItem[];
  structure: StructureData;
  watchPoints: string[];
  analysisVideoUrl: string;
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
  images: string[];
  match: string;
  date: string;
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
      `Parse error in "${filePath}": field "${field}" must be a non-empty string (got ${JSON.stringify(value)})`
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
      `Parse error in "${filePath}": field "${field}" must be an array of strings (got ${JSON.stringify(value)})`
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
      `Parse error in "${filePath}": field "${field}" must be a number (got ${JSON.stringify(value)})`
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
      `Parse error in "${filePath}": field "${field}" must be one of ${JSON.stringify(allowed)} (got ${JSON.stringify(value)})`
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
    images: assertStringArray(data, 'images', filePath),
    match: assertString(data, 'match', filePath),
    date: assertString(data, 'date', filePath),
  };
}

// ─── Directory Resolution ─────────────────────────────────────────────────────

function getDataDir(subDir: string): string {
  return path.join(process.cwd(), 'data', subDir);
}

function getYamlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
}

function parseYaml(filePath: string): Record<string, unknown> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw);
  if (typeof data !== 'object' || data === null) {
    throw new Error(`Parse error in "${filePath}": file must contain a YAML object`);
  }
  return data as Record<string, unknown>;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<ArticleFrontmatter[]> {
  const dir = getDataDir('articles');
  const files = getYamlFiles(dir);
  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const data = parseYaml(filePath);
    return validateArticleFrontmatter(data, filePath);
  });
}

export async function getArticleById(
  id: string
): Promise<ArticleData | null> {
  const dir = getDataDir('articles');
  const files = getYamlFiles(dir);
  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const data = parseYaml(filePath);
    const frontmatter = validateArticleFrontmatter(data, filePath);
    if (frontmatter.id === id) {
      return {
        ...frontmatter,
        introduction: (data.introduction as string) ?? '',
        conversations: (data.conversations as ConversationItem[]) ?? [],
        structure: (data.structure as StructureData) ?? { situation: '', decision: '', result: '' },
        watchPoints: (data.watchPoints as string[]) ?? [],
        analysisVideoUrl: assertString(data, 'analysisVideoUrl', filePath),
      };
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
    // positions still use MDX with gray-matter frontmatter
    const matter = require('gray-matter');
    const { data } = matter(raw);
    return validatePositionFrontmatter(data as Record<string, unknown>, filePath);
  });
}

export async function getAllGallery(): Promise<GalleryFrontmatter[]> {
  const dir = getDataDir('gallery');
  const files = getYamlFiles(dir);
  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const data = parseYaml(filePath);
    return validateGalleryFrontmatter(data, filePath);
  });
}

// ─── Rule Types ───────────────────────────────────────────────────────────────

export interface RulePrinciple {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
}

export interface RuleData {
  id: string;
  title: string;
  description: string;
  detail: string;
  level: '初級' | '中級' | '上級';
  principleId: string;
  icon: string;
  illustration: string;
  relatedRuleIds: string[];
}

// ─── Rule Loaders ─────────────────────────────────────────────────────────────

export async function getAllPrinciples(): Promise<RulePrinciple[]> {
  const filePath = path.join(getDataDir('rules'), 'principles.yaml');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as RulePrinciple[];
}

export async function getAllRules(): Promise<RuleData[]> {
  const filePath = path.join(getDataDir('rules'), 'rules.yaml');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as RuleData[];
}

export async function getRuleById(id: string): Promise<RuleData | null> {
  const rules = await getAllRules();
  return rules.find((r) => r.id === id) ?? null;
}
