import { SkillGem } from '../types/gem';
import { Criterion } from '../types/game';

export const ALL_CRITERIA: Criterion[] = [
  // Gem Colors / Attributes
  {
    id: 'color_red',
    name: 'Red Gem (STR)',
    shortName: 'Red (STR)',
    type: 'attribute',
    description: 'Strength / Red Skill Gem',
    matches: (gem) => gem.color === 'red' || gem.primaryAttribute === 'strength',
  },
  {
    id: 'color_green',
    name: 'Green Gem (DEX)',
    shortName: 'Green (DEX)',
    type: 'attribute',
    description: 'Dexterity / Green Skill Gem',
    matches: (gem) => gem.color === 'green' || gem.primaryAttribute === 'dexterity',
  },
  {
    id: 'color_blue',
    name: 'Blue Gem (INT)',
    shortName: 'Blue (INT)',
    type: 'attribute',
    description: 'Intelligence / Blue Skill Gem',
    matches: (gem) => gem.color === 'blue' || gem.primaryAttribute === 'intelligence',
  },

  // Primary Archetypes
  {
    id: 'type_spell',
    name: 'Spell',
    type: 'skill_type',
    description: 'Has the Spell tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'spell'),
  },
  {
    id: 'type_attack',
    name: 'Attack',
    type: 'skill_type',
    description: 'Has the Attack tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'attack'),
  },
  {
    id: 'type_minion',
    name: 'Minion',
    type: 'skill_type',
    description: 'Has the Minion tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'minion'),
  },
  {
    id: 'type_warcry',
    name: 'Warcry',
    type: 'skill_type',
    description: 'Has the Warcry tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'warcry'),
  },
  {
    id: 'type_aura',
    name: 'Aura',
    type: 'skill_type',
    description: 'Has the Aura tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'aura'),
  },
  {
    id: 'type_movement',
    name: 'Movement',
    type: 'skill_type',
    description: 'Has the Movement or Travel tag',
    matches: (gem) => gem.tags.some((t) => ['movement', 'travel', 'blink'].includes(t.toLowerCase())),
  },

  // Elements / Damage Types
  {
    id: 'elem_fire',
    name: 'Fire',
    type: 'element',
    description: 'Has the Fire tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'fire'),
  },
  {
    id: 'elem_cold',
    name: 'Cold',
    type: 'element',
    description: 'Has the Cold tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'cold'),
  },
  {
    id: 'elem_lightning',
    name: 'Lightning',
    type: 'element',
    description: 'Has the Lightning tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'lightning'),
  },
  {
    id: 'elem_chaos',
    name: 'Chaos',
    type: 'element',
    description: 'Has the Chaos tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'chaos'),
  },
  {
    id: 'elem_physical',
    name: 'Physical',
    type: 'element',
    description: 'Has the Physical tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'physical'),
  },

  // Delivery / Mechanics
  {
    id: 'mech_projectile',
    name: 'Projectile',
    type: 'delivery',
    description: 'Has the Projectile tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'projectile'),
  },
  {
    id: 'mech_aoe',
    name: 'AoE',
    type: 'delivery',
    description: 'Has the AoE tag (Area of Effect)',
    matches: (gem) => gem.tags.some((t) => ['aoe', 'area'].includes(t.toLowerCase())),
  },
  {
    id: 'mech_melee',
    name: 'Melee / Strike / Slam',
    shortName: 'Melee',
    type: 'delivery',
    description: 'Has Melee, Strike, or Slam tag',
    matches: (gem) => gem.tags.some((t) => ['melee', 'strike', 'slam'].includes(t.toLowerCase())),
  },
  {
    id: 'mech_bow',
    name: 'Bow',
    type: 'delivery',
    description: 'Has Bow tag or weapon requirement',
    matches: (gem) =>
      gem.tags.some((t) => t.toLowerCase() === 'bow') ||
      (gem.weaponTypes?.some((w) => w.toLowerCase().includes('bow')) ?? false),
  },
  {
    id: 'mech_channeling',
    name: 'Channelling',
    type: 'mechanic',
    description: 'Has the Channelling tag',
    matches: (gem) => gem.tags.some((t) => t.toLowerCase() === 'channelling'),
  },
  {
    id: 'mech_totem_trap_mine',
    name: 'Totem / Trap / Mine',
    shortName: 'Totem/Trap/Mine',
    type: 'mechanic',
    description: 'Has Totem, Trap, or Mine tag',
    matches: (gem) => gem.tags.some((t) => ['totem', 'ballista', 'trap', 'mine'].includes(t.toLowerCase())),
  },

  // Properties
  {
    id: 'prop_vaal',
    name: 'Vaal Skill',
    type: 'property',
    description: 'Is a Vaal gem',
    matches: (gem) => gem.isVaal || gem.tags.some((t) => t.toLowerCase() === 'vaal'),
  },
  {
    id: 'prop_transfigured',
    name: 'Transfigured',
    type: 'property',
    description: 'Is a Transfigured gem (of the ...)',
    matches: (gem) => gem.isTransfigured || gem.name.includes(' of '),
  },
];

export const CRITERIA_MAP = new Map<string, Criterion>(
  ALL_CRITERIA.map((c) => [c.id, c])
);

/**
 * Checks if a gem satisfies both row and column criteria.
 */
export function gemMatchesCriteria(
  gem: SkillGem,
  rowCriterion: Criterion,
  colCriterion: Criterion
): boolean {
  return rowCriterion.matches(gem) && colCriterion.matches(gem);
}

/**
 * Find all gems that match a pair of criteria.
 */
export function getMatchingGems(
  gems: SkillGem[],
  rowCriterion: Criterion,
  colCriterion: Criterion
): SkillGem[] {
  return gems.filter((gem) => gemMatchesCriteria(gem, rowCriterion, colCriterion));
}
