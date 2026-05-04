type MatchResult = { homeGoals: number; awayGoals: number };
type PredictionResult = { homeScore: number; awayScore: number };

export const PRODE_POINTS = {
  exact: 3,
  winner: 1,
} as const;

function sign(a: number, b: number) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

export function calcPredictionPoints(match: MatchResult, prediction: PredictionResult) {
  if (match.homeGoals === prediction.homeScore && match.awayGoals === prediction.awayScore) {
    return PRODE_POINTS.exact;
  }

  const matchSign = sign(match.homeGoals, match.awayGoals);
  const predSign = sign(prediction.homeScore, prediction.awayScore);

  if (matchSign === predSign) return PRODE_POINTS.winner;
  return 0;
}
