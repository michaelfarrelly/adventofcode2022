import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Day1 } from "./Day1";
import { Day2 } from "./Day2";
import { Day3 } from "./Day3";
import { Day4 } from "./Day4";
import { Day5 } from "./Day5";

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
            <button onClick={() => setDay(3)}>Day 3</button>
            <button onClick={() => setDay(4)}>Day 4</button>
            <button onClick={() => setDay(5)}>Day 5</button>
          </>
        )}
        {day > 0 && <button onClick={() => setDay(0)}>Reset day</button>}
        {day === 1 && <Day1 />}
        {day === 2 && <Day2 />}
        {day === 3 && <Day3 />}
        {day === 4 && <Day4 />}
        {day === 5 && <Day5 />}
      </div>
    </div>
  );
}

export default App;
