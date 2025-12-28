export enum GameMode {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED'
}

export enum GamePhase {
  SETUP = 'SETUP',
  ROUND_START = 'ROUND_START',
  SEAT_SWAP = 'SEAT_SWAP',
  RESOLUTION = 'RESOLUTION',
  ROUND_END = 'ROUND_END'
}

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
  bioConcept: string;
  ability: string;
  victoryCondition: string;
  icon: string;
}

export interface Player {
  id: string; 
  pairId: number;
  name: string;
  role: RoleType;
  immunityExpiresRound: number;
  pendingInfectionRound?: number;
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
