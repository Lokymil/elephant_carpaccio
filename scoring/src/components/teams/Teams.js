import Team from "./Team";
import "./Teams.css";

const Teams = ({ teams = [] }) => {
  return (
    <div className="teams">
      {teams.map((team) => (
        <Team key={team.name} team={team} />
      ))}
    </div>
  );
};

export default Teams;
