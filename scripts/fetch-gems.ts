/**
 * PoE 1 Skill Gems Ingestion Script
 *
 * Fetches all Active Skill Gems from the official PoE Community Wiki (poewiki.net)
 * via the MediaWiki Cargo API and compiles them into `src/data/gems.json`.
 *
 * Run with: npm run fetch:gems
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SkillGem, GemColor, PrimaryAttribute } from '../src/types/gem';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/gems.json');

const CARGO_ENDPOINT = 'https://www.poewiki.net/api.php';

interface CargoItem {
  name: string;
  primary_attribute?: string;
  gem_tags?: string;
  is_vaal?: string;
  inventory_icon?: string;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseAttribute(attr?: string): { color: GemColor; primaryAttribute: PrimaryAttribute } {
  const lower = (attr || '').toLowerCase();
  if (lower.includes('strength') || lower.includes('str')) {
    return { color: 'red', primaryAttribute: 'strength' };
  }
  if (lower.includes('dexterity') || lower.includes('dex')) {
    return { color: 'green', primaryAttribute: 'dexterity' };
  }
  if (lower.includes('intelligence') || lower.includes('int')) {
    return { color: 'blue', primaryAttribute: 'intelligence' };
  }
  return { color: 'white', primaryAttribute: 'none' };
}

function parseTags(gemTagsStr?: string): string[] {
  if (!gemTagsStr) return [];
  const set = new Set<string>();

  gemTagsStr.split(',').forEach((t) => {
    const clean = decodeHtmlEntities(t.trim());
    if (clean) set.add(clean);
  });

  return Array.from(set);
}

function normalizeId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function fetchActiveGemsBatch(offset = 0, limit = 500): Promise<CargoItem[]> {
  const params = new URLSearchParams({
    action: 'cargoquery',
    format: 'json',
    tables: 'skill_gems,items',
    join_on: 'skill_gems._pageName=items._pageName',
    fields: [
      'items.name=name',
      'skill_gems.primary_attribute=primary_attribute',
      'skill_gems.gem_tags=gem_tags',
      'skill_gems.is_vaal_skill_gem=is_vaal',
      'items.inventory_icon=inventory_icon',
    ].join(','),
    where: 'skill_gems.support_gem_letter IS NULL AND items.name IS NOT NULL',
    limit: String(limit),
    offset: String(offset),
  });

  const url = `${CARGO_ENDPOINT}?${params.toString()}`;
  console.log(`Fetching batch: offset ${offset}...`);

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'PoEDoku-Fetcher/1.0 (https://github.com/poedoku; contact: poedoku@example.com)',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as { cargoquery?: Array<{ title: CargoItem }> };
  if (!json.cargoquery) {
    return [];
  }

  return json.cargoquery.map((entry) => entry.title);
}

async function main() {
  console.log('🚀 Starting PoE 1 Active Skill Gems extraction from PoEWiki Cargo API...');

  const allItems: CargoItem[] = [];
  let offset = 0;
  const limit = 500;
  let hasMore = true;

  while (hasMore) {
    try {
      const batch = await fetchActiveGemsBatch(offset, limit);
      allItems.push(...batch);
      console.log(`Received ${batch.length} gems. (Total so far: ${allItems.length})`);

      if (batch.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    } catch (err) {
      console.error(`Error during batch fetch at offset ${offset}:`, err);
      break;
    }
  }

  if (allItems.length === 0) {
    console.warn('⚠️ No gems fetched from API. Check network or parameters.');
    return;
  }

  // Deduplicate and process into SkillGem format
  const gemMap = new Map<string, SkillGem>();

  for (const raw of allItems) {
    const name = decodeHtmlEntities(raw.name.trim());
    if (!name || gemMap.has(name)) continue;

    const { color, primaryAttribute } = parseAttribute(raw.primary_attribute);
    const tags = parseTags(raw.gem_tags);
    const isVaal = raw.is_vaal === '1' || name.startsWith('Vaal ') || tags.some((t) => t.toLowerCase() === 'vaal');
    const isTransfigured = name.includes(' of ');

    let baseGem: string | undefined;
    if (isVaal) {
      baseGem = name.replace(/^Vaal\s+/, '');
    } else if (isTransfigured) {
      baseGem = name.split(' of ')[0];
    }

    let iconUrl = '';
    if (raw.inventory_icon) {
      const cleanFile = decodeHtmlEntities(raw.inventory_icon).replace(/^File:/, '').replace(/\s+/g, '_');
      iconUrl = `https://www.poewiki.net/wiki/Special:Filepath/${cleanFile}`;
    }

    const gem: SkillGem = {
      id: normalizeId(name),
      name,
      icon: iconUrl,
      color,
      primaryAttribute,
      tags,
      isVaal,
      isTransfigured,
      baseGem,
      requiredLevel: 1,
    };

    gemMap.set(name, gem);
  }

  const gemsList = Array.from(gemMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(gemsList, null, 2), 'utf-8');

  console.log(`✅ Successfully compiled ${gemsList.length} skill gems to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal fetch error:', err);
  process.exit(1);
});
