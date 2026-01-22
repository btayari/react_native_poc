import { MatchPrediction } from '@/types/match-prediction';

export const MATCH_PREDICTION_DATA: MatchPrediction = {
  homeTeam: 'Man City',
  awayTeam: 'Arsenal',
  homeTeamLogo: 'https://resources.premierleague.com/premierleague/badges/t43.png',
  awayTeamLogo: 'https://resources.premierleague.com/premierleague/badges/t3.png',
  matchDate: new Date('2026-10-24T20:00:00'),
  venue: 'Etihad',
  confidenceLevel: 'High Confidence',
  winProbability: {
    homeWin: 0.45,
    draw: 0.20,
    awayWin: 0.35,
  },
  predictedStats: {
    expectedGoals: {
      metric: 'Expected Goals\n(xG)',
      homeValue: 1.85,
      awayValue: 1.20,
    },
    possession: {
      metric: 'Possession',
      homeValue: 55,
      awayValue: 45,
    },
    shotsOnTarget: {
      metric: 'Shots on Target',
      homeValue: 8,
      awayValue: 4,
    },
    passCompletion: {
      metric: 'Pass Completion',
      homeValue: 84,
      awayValue: 79,
    },
    ppda: {
      metric: 'PPDA',
      homeValue: 12,
      awayValue: 9.10,
    },
  },
  tacticalInsight: {
    title: 'Tactical Insight',
    description: 'Deploying an overload in midfield significantly increases xG (+0.4) against Arsenal\'s current low block setup.',
  },
  modelVersion: 'Model v2.4',
};
