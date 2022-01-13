import { useState, useEffect } from "react";
import { socket } from "./socket";

function App() {
  const [teams, setTeams] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  useEffect(() => {}, []);

  socket.on("current", ({ teams, isStarted }) => {
    setTeams(teams);
    setIsStarted(isStarted);
  });

  const startGame = () => {
    socket.emit("start");
  };

  return (
    <div className="App">
      <div
        className="teams"
        style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {teams.map((team) => (
          <div id={team.name}>
            <h2>{team.name}</h2>
            <div>{team.points}</div>
          </div>
        ))}
      </div>
      <button disabled={isStarted} onClick={startGame}>
        Start !
      </button>
    </div>
  );
}

export default App;
