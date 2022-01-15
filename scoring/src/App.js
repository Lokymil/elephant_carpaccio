import { useState, useEffect } from "react";
import { socket } from "./socket";
import "./App.css";
import Timer from "./Timer";
import Team from "./Team";

function App() {
  const [teams, setTeams] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [remainingDifficultyTime, setRemainingDifficultyTime] = useState(0);
  useEffect(() => {}, []);

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
    <div className="App">
      <h1>Elephant carpaccio</h1>
      <div className="teams">
        {teams.map((team) => (
          <Team key={team.name} team={team} />
        ))}
      </div>
      <div className="metadata">
        <Timer title="Temps restant" remainingTime={remainingTime} />
        <h3>Difficulty level : {difficulty}</h3>
        <Timer
          title="Temps restant pour cette difficulté"
          remainingTime={remainingDifficultyTime}
        />
      </div>
      {!isStarted && <button onClick={startGame}>Start !</button>}
    </div>
  );
}

export default App;
