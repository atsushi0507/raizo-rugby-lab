import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface GlossaryEntry {
  term: string;
  description: string;
}

let cachedGlossary: GlossaryEntry[] | null = null;

export function getGlossary(): GlossaryEntry[] {
  if (cachedGlossary) return cachedGlossary;
  const filePath = path.join(process.cwd(), 'data', 'glossary.yaml');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as GlossaryEntry[];
  // 長い用語を先にマッチさせるためソート
  cachedGlossary = data.sort((a, b) => b.term.length - a.term.length);
  return cachedGlossary;
}
