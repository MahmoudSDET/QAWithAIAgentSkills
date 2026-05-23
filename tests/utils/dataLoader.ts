import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadJson<T>(relativePath: string): T {
  const fullPath = resolve(process.cwd(), 'tests', 'data', relativePath);
  return JSON.parse(readFileSync(fullPath, 'utf-8')) as T;
}
