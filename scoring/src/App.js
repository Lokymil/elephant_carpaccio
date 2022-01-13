import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const socketContainer = useRef(null);
  const [teams, setTeams] = useState([]);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    socketContainer.current = io("http://localhost:3000/scores");
  }, []);

  socketContainer.current?.on("current", ({ teams, isStarted }) => {
    setTeams(teams);
    setIsStarted(isStarted);
  });

  const startGame = () => {
    socketContainer.current?.emit("start");
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
