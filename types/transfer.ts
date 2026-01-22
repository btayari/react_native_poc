import { ImageSourcePropType } from 'react-native';
import { PlayerPosition } from './lineup';

export interface TransferPlayer {
  name: string;
  imageUrl: ImageSourcePropType;
  rating: number;
  position: PlayerPosition;
  displayPosition: string;
  age: number;
  shirtNumber: number;
  club: string;
  isSuggested?: boolean;
}

export interface RecentTransfer {
  playerName: string;
  fromClub: string;
  toClub: string;
  fee: string;
  date: string;
  position: string;
}
