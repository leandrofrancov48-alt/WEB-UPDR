import { prisma } from "./db";

export async function getActiveTournamentsSorted() {
  const tournaments = await prisma.tournament.findMany({
    where: { active: true },
  });

  const now = new Date();

  // For each tournament, find the match date closest to now
  const tournamentsWithClosestMatch = await Promise.all(
    tournaments.map(async (tournament) => {
      // Find the closest upcoming match
      const upcomingMatch = await prisma.match.findFirst({
        where: {
          tournamentId: tournament.id,
          matchDate: { gte: now }
        },
        orderBy: { matchDate: 'asc' },
        select: { matchDate: true }
      });

      // Find the closest past match
      const pastMatch = await prisma.match.findFirst({
        where: {
          tournamentId: tournament.id,
          matchDate: { lt: now }
        },
        orderBy: { matchDate: 'desc' },
        select: { matchDate: true }
      });

      let minDiff = Infinity;

      if (upcomingMatch) {
        minDiff = Math.min(minDiff, Math.abs(upcomingMatch.matchDate.getTime() - now.getTime()));
      }
      if (pastMatch) {
        minDiff = Math.min(minDiff, Math.abs(now.getTime() - pastMatch.matchDate.getTime()));
      }

      return {
        tournament,
        minDiff
      };
    })
  );

  // Sort by minDiff asc, so the tournament with matches closest to now is first.
  // If no matches exist for either, we keep their database order.
  tournamentsWithClosestMatch.sort((a, b) => a.minDiff - b.minDiff);

  return tournamentsWithClosestMatch.map(t => t.tournament);
}

export async function getAllTournamentsSorted() {
  const tournaments = await prisma.tournament.findMany();

  const now = new Date();

  // For each tournament, find the match date closest to now
  const tournamentsWithClosestMatch = await Promise.all(
    tournaments.map(async (tournament) => {
      // Find the closest upcoming match
      const upcomingMatch = await prisma.match.findFirst({
        where: {
          tournamentId: tournament.id,
          matchDate: { gte: now }
        },
        orderBy: { matchDate: 'asc' },
        select: { matchDate: true }
      });

      // Find the closest past match
      const pastMatch = await prisma.match.findFirst({
        where: {
          tournamentId: tournament.id,
          matchDate: { lt: now }
        },
        orderBy: { matchDate: 'desc' },
        select: { matchDate: true }
      });

      let minDiff = Infinity;

      if (upcomingMatch) {
        minDiff = Math.min(minDiff, Math.abs(upcomingMatch.matchDate.getTime() - now.getTime()));
      }
      if (pastMatch) {
        minDiff = Math.min(minDiff, Math.abs(now.getTime() - pastMatch.matchDate.getTime()));
      }

      return {
        tournament,
        minDiff,
        isActiveStatus: tournament.status === "ACTIVE" && tournament.active
      };
    })
  );

  // Sort: active status first, then by minDiff asc, then by createdAt desc
  tournamentsWithClosestMatch.sort((a, b) => {
    if (a.isActiveStatus !== b.isActiveStatus) {
      return a.isActiveStatus ? -1 : 1;
    }
    if (a.minDiff !== b.minDiff) {
      return a.minDiff - b.minDiff;
    }
    return b.tournament.createdAt.getTime() - a.tournament.createdAt.getTime();
  });

  return tournamentsWithClosestMatch.map(t => t.tournament);
}
