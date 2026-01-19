import { Player, PlayerPosition, Formation } from '@/types/lineup';

export const PLAYERS: Player[] = [
  // Goalkeeper
  {
    name: 'Ederson',
    imageUrl: 'assets/players/ederson.jpg',
    rating: 8.4,
    position: PlayerPosition.GOALKEEPER,
  },
  // Defenders
  {
    name: 'Gvardiol',
    imageUrl: 'assets/players/gvardiol.jpg',
    rating: 7.8,
    position: PlayerPosition.DEFENDER,
  },
  {
    name: 'Dias',
    imageUrl: 'assets/players/dias.jpg',
    rating: 8.1,
    position: PlayerPosition.DEFENDER,
  },
  {
    name: 'Akanji',
    imageUrl: 'assets/players/akanji.jpg',
    rating: 7.5,
    position: PlayerPosition.DEFENDER,
  },
  {
    name: 'Walker',
    imageUrl: 'assets/players/walker.jpg',
    rating: 7.6,
    position: PlayerPosition.DEFENDER,
  },
  // Midfielders
  {
    name: 'Kovačić',
    imageUrl: 'assets/players/kovacic.jpg',
    rating: 7.9,
    position: PlayerPosition.MIDFIELDER,
  },
  {
    name: 'Rodri',
    imageUrl: 'assets/players/rodri.jpg',
    rating: 9.1,
    position: PlayerPosition.MIDFIELDER,
    isStarPlayer: true,
  },
  {
    name: 'Bernardo',
    imageUrl: 'assets/players/bernardo.jpg',
    rating: 8.3,
    position: PlayerPosition.MIDFIELDER,
  },
  // Forwards
  {
    name: 'Doku',
    imageUrl: 'assets/players/doku.jpg',
    rating: 7.7,
    position: PlayerPosition.FORWARD,
  },
  {
    name: 'Haaland',
    imageUrl: 'assets/players/haaland.jpg',
    rating: 9.4,
    position: PlayerPosition.FORWARD,
    isStarPlayer: true,
  },
  {
    name: 'Foden',
    imageUrl: 'assets/players/foden.jpg',
    rating: 8.8,
    position: PlayerPosition.FORWARD,
  },
];

export const FORMATIONS: Record<string, Formation> = {
  '4-3-3': {
    name: '4-3-3',
    displayName: '4-3-3 Attack',
    positions: [
      // Forwards (3)
      { playerIndex: 8, x: 0.18, y: 0.24 },
      { playerIndex: 9, x: 0.5, y: 0.20 },
      { playerIndex: 10, x: 0.82, y: 0.24 },
      // Midfielders (3)
      { playerIndex: 5, x: 0.25, y: 0.50 },
      { playerIndex: 6, x: 0.5, y: 0.55 },
      { playerIndex: 7, x: 0.75, y: 0.50 },
      // Defenders (4)
      { playerIndex: 1, x: 0.15, y: 0.76 },
      { playerIndex: 2, x: 0.38, y: 0.78 },
      { playerIndex: 3, x: 0.62, y: 0.78 },
      { playerIndex: 4, x: 0.85, y: 0.76 },
      // Goalkeeper (1)
      { playerIndex: 0, x: 0.5, y: 0.92 },
    ],
  },
  '4-4-2': {
    name: '4-4-2',
    displayName: '4-4-2 Classic',
    positions: [
      // Forwards (2)
      { playerIndex: 9, x: 0.35, y: 0.22 },
      { playerIndex: 10, x: 0.65, y: 0.22 },
      // Midfielders (4)
      { playerIndex: 8, x: 0.15, y: 0.45 },
      { playerIndex: 5, x: 0.38, y: 0.50 },
      { playerIndex: 6, x: 0.62, y: 0.50 },
      { playerIndex: 7, x: 0.85, y: 0.45 },
      // Defenders (4)
      { playerIndex: 1, x: 0.15, y: 0.76 },
      { playerIndex: 2, x: 0.38, y: 0.78 },
      { playerIndex: 3, x: 0.62, y: 0.78 },
      { playerIndex: 4, x: 0.85, y: 0.76 },
      // Goalkeeper (1)
      { playerIndex: 0, x: 0.5, y: 0.92 },
    ],
  },
};
