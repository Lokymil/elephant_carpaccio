import Timer from "./Timer";
import "./GameInfo.css";
import Difficulty from "./Difficulty";

const GameInfo = ({ remainingTime, difficulty, remainingDifficultyTime }) => {
  return (
    <div className="metadata">
      <Timer title="Coding end in" remainingTime={remainingTime} />
      <Difficulty difficulty={difficulty} />
      <Timer
        title="Next difficulty in"
        remainingTime={remainingDifficultyTime}
      />
    </div>
  );
};

export default GameInfo;
