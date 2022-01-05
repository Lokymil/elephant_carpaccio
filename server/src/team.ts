import { Team } from "./team.types";

export const generateTeam = (teamName: string): Team => {
  return {
    points: 0,
    name: teamName,
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
