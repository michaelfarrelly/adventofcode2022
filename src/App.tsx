import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Day1 } from "./Day1";

function App() {
  const [count, setCount] = useState(0);
  const [day, setDay] = useState<number>(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setDay(1)}>Day 1</button>
        {day === 1 && <Day1></Day1>}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
