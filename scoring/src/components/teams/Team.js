import './Team.css';

const Team = ({ team: { name, points, totalWins, winStreak, connected } }) => {
  return (
    <div className={`team ${connected ? 'connected' : 'disconnected'}`}>
      <h2>{points !== 0 ? `${rank}. ` : null}{name}</h2>
      <div>Score : {points}</div>
      <div>Wins : {totalWins}</div>
      <div>Streak : {winStreak}</div>
      <div className={`connection ${connected ? 'connected' : 'disconnected'}`}>
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
};

export default Team;
