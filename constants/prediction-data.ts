import { MatchPrediction } from '@/types/prediction';

export const getSamplePrediction = (): MatchPrediction => ({
  homeTeam: 'Man City',
  awayTeam: 'Arsenal',
  homeTeamLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmvawGNstsfmR1y3nA-LpEEAwol9hSkKvnOHTPK193vw4nyWKW4Qis3SxJ5dck0bg-q8KHIq5iD4WP1-YWIM3Xk2FQiLIywjbjZsrbAxwEc02mwx1Hp7bUgxJ55Ex0VZCXhTJcBOJz71QB-NWQqcNyzmQt5DURh6UE0dpTwmoJZB0ZG4MROPiG5MtoUHz1Ksb92usiIQ3LX775m--v6Ckk4ci4QEmy4zEIiSyM3L4oqJcIcLT6F2wzLfDyZxA563-fdoUvkoyMO2c',
  awayTeamLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_EGmL_C9Q2dghxxpda5sboknsKJbLIAiS4-P8S_ukOWpiXUML_HUHRlLB0YPjM3ibsOyGAwUgB6A3xJepNYos2c-wlPHAvWjhiH4qUYMVZoXeJvTGkZOXlW5ylfqsfWOoSGnwnf4mVb0ptXlyu8GcUudkzfwn4ThDtRj46gecfdj0ZRu3uU8-Vt_5azzAxv6MDUg3AlT-baDCqIKpPttlNW0Hk3wxLfWvhZfzyK8JaV8Lxo-NeHwYQIqQi9Esme4MiRUAvz0qnlQ',
  matchDate: new Date(2024, 9, 24, 20, 0),
  venue: 'Etihad',
  winProbability: {
    homeWin: 0.45,
    draw: 0.20,
    awayWin: 0.35,
  },
  predictedStats: {
    expectedGoals: {
      homeValue: 1.85,
      awayValue: 1.20,
      metric: 'Expected Goals (xG)',
    },
    possession: {
      homeValue: 55,
      awayValue: 45,
      metric: 'Possession',
    },
    shotsOnTarget: {
      homeValue: 6,
      awayValue: 4,
      metric: 'Shots on Target',
    },
    passCompletion: {
      homeValue: 84,
      awayValue: 79,
      metric: 'Pass Completion',
    },
    ppda: {
      homeValue: 12.4,
      awayValue: 9.1,
      metric: 'PPDA',
    },
  },
  tacticalInsight: {
    title: 'Tactical Insight',
    description: "Deploying an overload in midfield significantly increases xG (+0.4) against Arsenal's current low block setup.",
  },
  confidenceLevel: 'High Confidence',
  modelVersion: 'Model v2.4',
});

export const formatMatchDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${hour}:${minute}`;
};
