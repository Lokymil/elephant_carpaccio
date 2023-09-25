import Team from "./Team";
import "./Teams.css";

const Teams = ({ teams = [] }) => {
  return (
    <div className="teams">
      {teams.map((team, index) => (
        <Team key={team.name} rank={index + 1} team={team} />
      ))}
    </div>
  );
};

export default Teams;
