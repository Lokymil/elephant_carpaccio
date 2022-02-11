import { Team } from "./team.types";

export const generateTeam = (teamName: string): Team => {
  return {
    hasAnswerLast: false,
    points: 0,
    name: teamName,
    validAnswerInARow: 0,
    connected: false,
  };
};

export const enrichTeams = (teams: Team[], teamName: string): Team => {
  const newTeam = generateTeam(teamName);
  teams.push(newTeam);
  return newTeam;
};

export const getTeam = (teams: Team[], teamName: string): Team => {
  const currentTeam =
    teams.find((team) => team.name === teamName) ||
    enrichTeams(teams, teamName);

  return currentTeam;
};

export const resetValidAnswerStreak = (teams: Team[]): void => {
  teams.forEach((team) => {
    team.validAnswerInARow = 0;
  });
};

export const resetWinStreak = (team: Team): void => {
  team.validAnswerInARow = 0;
};

export const increaseWinStreak = (team: Team): void => {
  team.validAnswerInARow += 1;
};
