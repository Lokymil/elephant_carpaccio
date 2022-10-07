import Timer from "./Timer";

const GameInfo = ({ remainingTime, difficulty, remainingDifficultyTime }) => {
  return (
    <div className="metadata">
      <Timer
        title="Remaining time before the end"
        remainingTime={remainingTime}
      />
      <h3>Difficulty level : {difficulty}</h3>
      <Timer
        title="Remaining time before difficulty auto-increase"
        remainingTime={remainingDifficultyTime}
      />
    </div>
  );
};

export default GameInfo;
