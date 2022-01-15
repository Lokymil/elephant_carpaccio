import { useState, useEffect } from "react";
import { socket } from "./socket";
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(0);
  useEffect(() => {}, []);

  socket.on("current", ({ teams, isStarted, difficulty }) => {
    setTeams(teams);
    setIsStarted(isStarted);
    setDifficulty(difficulty);
  });

  const startGame = () => {
    socket.emit("start");
  };

  return (
    <div className="App">
      <div className="teams">
        {teams.map((team) => (
          <div id={team.name}>
            <h2>{team.name}</h2>
            <div>Score : {team.points}</div>
          </div>
        ))}
      </div>
      <div>Difficulty level : {difficulty}</div>
      {!isStarted && <button onClick={startGame}>Start !</button>}
    </div>
  );
}

export default App;
