import { useState } from "react";
import { socket } from "./socket";
import Teams from "./components/teams/Teams";
import "./App.css";
import GameInfo from "./components/metadata/GameInfo";
import Header from "./components/layout/Header";

function App() {
  const [teams, setTeams] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [remainingDifficultyTime, setRemainingDifficultyTime] = useState(0);

  socket.on(
    "current",
    ({
      teams,
      isStarted,
      difficulty,
      remainingTime,
      remainingDifficultyTime,
    }) => {
      setTeams(teams);
      setIsStarted(isStarted);
      setDifficulty(difficulty);
      setRemainingTime(remainingTime);
      setRemainingDifficultyTime(remainingDifficultyTime);
    }
  );

  const startGame = () => {
    socket.emit("start");
  };

  return (
    <div>
      <Header />
      <Teams teams={teams} />
      <GameInfo
        remainingTime={remainingTime}
        difficulty={difficulty}
        remainingDifficultyTime={remainingDifficultyTime}
      />
      <div className="actions">
        {!isStarted && <button onClick={startGame}>Start !</button>}
      </div>
    </div>
  );
}

export default App;
