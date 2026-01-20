import { ImageSourcePropType } from 'react-native';

export enum PlayerPosition {
  GOALKEEPER = 'goalkeeper',
  DEFENDER = 'defender',
  MIDFIELDER = 'midfielder',
  FORWARD = 'forward',
}

export interface Player {
  name: string;
  imageUrl: string;
  rating: number;
  position: PlayerPosition;
  isStarPlayer?: boolean;
}

export interface PlayerPositionData {
  playerIndex: number;
  x: number;
  y: number;
}

export interface Formation {
  name: string;
  displayName: string;
  positions: PlayerPositionData[];
}

export interface SquadPlayer {
  name: string;
  imageUrl: ImageSourcePropType;
  rating: number;
  position: PlayerPosition;
  isStarPlayer?: boolean;
  age: number;
  shirtNumber: number;
  displayPosition: string;
  club: string;
  isSuggested?: boolean;
}
