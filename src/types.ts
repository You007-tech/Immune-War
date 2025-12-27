
export enum RoleType {
  IMMUNE_CELL = 'IMMUNE_CELL',
  VIRUS = 'VIRUS',
  CIVILIAN_CELL = 'CIVILIAN_CELL'
}

export enum Faction {
  IMMUNE_SYSTEM = '免疫阵营',
  VIRUS_HORDE = '病毒阵营'
}

export interface RoleData {
  id: RoleType;
  name: string;
  faction: Faction;
  description: string;
  bioConcept: string; // The real biology behind it
  ability: string;
  victoryCondition: string; // New field
  icon: string;
}

export enum GamePhase {
  SETUP = 'SETUP',
  ROUND_START = 'ROUND_START',
  SEAT_SWAP = 'SEAT_SWAP',
  RESOLUTION = 'RESOLUTION',
  ROUND_END = 'ROUND_END'
}

export interface Player {
  id: number;
  pairId: number; // 1 to 4, representing the table/seat pair
  name: string;
  role: RoleType;
  immunityExpiresRound: number; // The round number until which the player is immune
  statusEffects: string[];
}

export interface GameLog {
  round: number;
  message: string;
  timestamp: string;
  type: 'action' | 'system' | 'alert';
}

export interface GameStats {
  round: number;
  virusCount: number;
  immuneCellCount: number;
  civilianCount: number;
}
