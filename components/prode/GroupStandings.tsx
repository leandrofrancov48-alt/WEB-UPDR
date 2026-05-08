import React from "react";

type TeamStats = {
  id: string;
  name: string;
  flagUrl: string | null;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
};

export function GroupStandings({ group, teams, matches }: { group: any, teams: any[], matches: any[] }) {
  // Initialize stats for all teams
  const statsMap: Record<string, TeamStats> = {};
  teams.forEach(team => {
    statsMap[team.id] = {
      id: team.id,
      name: team.name,
      flagUrl: team.flagUrl,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
    };
  });

  // Calculate points and goals from finished matches
  matches.forEach(match => {
    if (match.status === "FINISHED" && match.homeScore !== null && match.awayScore !== null) {
      const home = statsMap[match.homeTeamId];
      const away = statsMap[match.awayTeamId];

      if (home && away) {
        home.played += 1;
        away.played += 1;

        home.gf += match.homeScore;
        home.ga += match.awayScore;
        home.gd = home.gf - home.ga;

        away.gf += match.awayScore;
        away.ga += match.homeScore;
        away.gd = away.gf - away.ga;

        if (match.homeScore > match.awayScore) {
          home.won += 1;
          home.points += 3;
          away.lost += 1;
        } else if (match.homeScore < match.awayScore) {
          away.won += 1;
          away.points += 3;
          home.lost += 1;
        } else {
          home.drawn += 1;
          away.drawn += 1;
          home.points += 1;
          away.points += 1;
        }
      }
    }
  });

  // Convert to array and sort
  // Criteria: 1) Points, 2) Goal Difference, 3) Goals For
  const standings = Object.values(statsMap).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-white text-black rounded-lg overflow-hidden shadow-lg mb-10 w-full max-w-3xl font-sans">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {group.name} <span className="font-normal text-gray-600">Copa Mundial FIFA 2026</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-600">
              <th className="py-3 px-4 font-semibold text-center w-16">Pos</th>
              <th className="py-3 px-4 font-semibold">Equipo</th>
              <th className="py-3 px-4 font-semibold text-center hidden sm:table-cell" title="Partidos Jugados">PJ</th>
              <th className="py-3 px-4 font-semibold text-center hidden sm:table-cell" title="Diferencia de Gol">DIF</th>
              <th className="py-3 px-4 font-semibold text-center bg-gray-200/50 w-20">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-center font-bold text-gray-700">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {team.flagUrl ? (
                      <img src={team.flagUrl} alt={team.name} className="w-8 h-5 object-cover rounded-sm shadow-sm border border-gray-200" />
                    ) : (
                      <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                    )}
                    <span className="text-blue-600 font-medium">{team.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-gray-600 hidden sm:table-cell">{team.played}</td>
                <td className="py-3 px-4 text-center text-gray-600 hidden sm:table-cell">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td className="py-3 px-4 text-center font-bold bg-gray-200/50 text-gray-800">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
