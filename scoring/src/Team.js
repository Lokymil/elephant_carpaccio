const Team = ({ team: { name, points, validAnswerInARow } }) => {
  return (
    <div className="team">
      <h2>{name}</h2>
      <div>Score : {points}</div>
      <div>Streak : {validAnswerInARow}</div>
    </div>
  );
};

export default Team;
