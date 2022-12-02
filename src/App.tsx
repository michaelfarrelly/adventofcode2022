import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Day1 } from "./Day1";
import { Day2 } from "./Day2";

function App() {
  const [count, setCount] = useState(0);
  const [day, setDay] = useState<number>(0);

  return (
    <div className="App">
      <h1>Advent of Code 2022</h1>
      <div className="card">
        {day == 0 && (
          <>
            <button onClick={() => setDay(1)}>Day 1</button>
            <button onClick={() => setDay(2)}>Day 2</button>
          </>
        )}
        {day > 0 && <button onClick={() => setDay(0)}>Reset day</button>}
        {day === 1 && <Day1 />}
        {day === 2 && <Day2 />}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
