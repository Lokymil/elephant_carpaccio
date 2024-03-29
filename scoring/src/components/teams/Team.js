import './Team.css';

const Team = ({ team: { name, points, winStreak, connected } }) => {
  return (
    <div className={`team ${connected ? 'connected' : 'disconnected'}`}>
      <h2>{name}</h2>
      <div>Score : {points}</div>
      <div>Streak : {winStreak}</div>
      <div className={`connection ${connected ? 'connected' : 'disconnected'}`}>
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
};

export default Team;
