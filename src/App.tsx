import { useCallback, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Day1 } from "./Day1";
import { Day2 } from "./Day2";
import { Day3 } from "./Day3";
import { Day4 } from "./Day4";
import { Day5 } from "./Day5";

const range = (start: number, end: number): number[] => {
  const items: number[] = [];
  for (let i = start; i <= end; i++) {
    items.push(i);
  }
  return items;
};

function App() {
  const [count, setCount] = useState(0);
  const [day, setDay] = useState<number>(0);
  const dayChanged = useCallback((value: string) => {
    setDay(parseInt(value));
  }, []);

  return (
    <div className="App">
      <h1>Advent of Code 2022</h1>
      <div className="card">
        Change Day:{" "}
        <select onChange={(e) => dayChanged(e.currentTarget.value)}>
          {range(1, 25).map((i) => {
            return <option value={i}>Day {i}</option>;
          })}
        </select>
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
