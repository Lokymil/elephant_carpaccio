import { useState, useRef } from "react";
import { io } from "socket.io-client";

function App() {
  // const socketContainer = useRef(io("http://localhost:3000/scores"));
  const [teams, setTeams] = useState([]);
  const [isStarted, setIsStarted] = useState(false);

  // socketContainer.current.on("current", ({ isStarted, teams }) => {
  //   setTeams(teams);
  //   setIsStarted(isStarted);
  // });

  const startGame = () => {
    // socketContainer.current.emit("start");
  };

  return (
    <div className="App">
      <div
        className="teams"
        style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {teams.map((team) => (
          <div>
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
