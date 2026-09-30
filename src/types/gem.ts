export type GemColor = 'red' | 'green' | 'blue' | 'white';

export type PrimaryAttribute = 'strength' | 'dexterity' | 'intelligence' | 'none';

export interface SkillGem {
  id: string;
  name: string;
  icon: string;
  color: GemColor;
  primaryAttribute: PrimaryAttribute;
  tags: string[]; // e.g., ["Spell", "AoE", "Fire", "Channelling"]
  isVaal: boolean;
  isTransfigured: boolean;
  baseGem?: string;
  weaponTypes?: string[];
  requiredLevel: number;
}
