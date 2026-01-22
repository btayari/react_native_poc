export interface WinProbability {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export interface StatComparison {
  metric: string;
  homeValue: number | string;
  awayValue: number | string;
}

export interface PredictedStats {
  expectedGoals: StatComparison;
  possession: StatComparison;
  shotsOnTarget: StatComparison;
  passCompletion: StatComparison;
  ppda: StatComparison;
}

export interface TacticalInsight {
  title: string;
  description: string;
}

export interface MatchPrediction {
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  matchDate: Date;
  venue: string;
  confidenceLevel: string;
  winProbability: WinProbability;
  predictedStats: PredictedStats;
  tacticalInsight: TacticalInsight;
  modelVersion: string;
}
