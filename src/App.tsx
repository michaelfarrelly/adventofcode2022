import { useCallback, useState } from "react";
import "./App.css";
import { Day1 } from "./Day1";
import { Day10 } from "./Day10";
import { Day11 } from "./Day11";
import { Day12 } from "./Day12";
import { Day13 } from "./Day13";
import { Day14 } from "./Day14";
import { Day15 } from "./Day15";
import { Day16 } from "./Day16";
import { Day17 } from "./Day17";
import { Day18 } from "./Day18";
import { Day19 } from "./Day19";
import { Day2 } from "./Day2";
import { Day20 } from "./Day20";
import { Day21 } from "./Day21";
import { Day22 } from "./Day22";
import { Day23 } from "./Day23";
import { Day24 } from "./Day24";
import { Day25 } from "./Day25";
import { Day3 } from "./Day3";
import { Day4 } from "./Day4";
import { Day5 } from "./Day5";
import { Day6 } from "./Day6";
import { Day7 } from "./Day7";
import { Day8 } from "./Day8";
import { Day9 } from "./Day9";

const range = (start: number, end: number): number[] => {
  const items: number[] = [];
  for (let i = start; i <= end; i++) {
    items.push(i);
  }
  return items;
};

function App() {
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
        {day === 6 && <Day6 />}
        {day === 7 && <Day7 />}
        {day === 8 && <Day8 />}
        {day === 9 && <Day9 />}
        {day === 10 && <Day10 />}
        {day === 11 && <Day11 />}
        {day === 12 && <Day12 />}
        {day === 13 && <Day13 />}
        {day === 14 && <Day14 />}
        {day === 15 && <Day15 />}
        {day === 16 && <Day16 />}
        {day === 17 && <Day17 />}
        {day === 18 && <Day18 />}
        {day === 19 && <Day19 />}
        {day === 20 && <Day20 />}
        {day === 21 && <Day21 />}
        {day === 22 && <Day22 />}
        {day === 23 && <Day23 />}
        {day === 24 && <Day24 />}
        {day === 25 && <Day25 />}
      </div>
    </div>
  );
}

export default App;
