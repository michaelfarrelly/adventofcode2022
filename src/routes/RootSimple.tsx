import { Routes, Route, Link, Outlet } from "react-router-dom";
import styles from "./App.module.css";
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

export default function App() {
    return (
        <div>
            {/* Routes nest inside one another. Nested route paths build upon
              parent route paths, and nested route elements render inside
              parent route elements. See the note about <Outlet> below. */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="day1" element={<Day1 />} />
                    <Route path="day2" element={<Day2 />} />
                    <Route path="day3" element={<Day3 />} />
                    <Route path="day4" element={<Day4 />} />
                    <Route path="day5" element={<Day5 />} />
                    <Route path="day6" element={<Day6 />} />
                    <Route path="day7" element={<Day7 />} />
                    <Route path="day8" element={<Day8 />} />
                    <Route path="day9" element={<Day9 />} />
                    <Route path="day10" element={<Day10 />} />
                    <Route path="day11" element={<Day11 />} />
                    <Route path="day12" element={<Day12 />} />
                    <Route path="day13" element={<Day13 />} />
                    <Route path="day14" element={<Day14 />} />
                    <Route path="day15" element={<Day15 />} />
                    <Route path="day16" element={<Day16 />} />
                    <Route path="day17" element={<Day17 />} />
                    <Route path="day18" element={<Day18 />} />
                    <Route path="day19" element={<Day19 />} />
                    <Route path="day20" element={<Day20 />} />
                    <Route path="day21" element={<Day21 />} />
                    <Route path="day22" element={<Day22 />} />
                    <Route path="day23" element={<Day23 />} />
                    <Route path="day24" element={<Day24 />} />
                    <Route path="day25" element={<Day25 />} />

                    {/* Using path="*"" means "match anything", so this route
                  acts like a catch-all for URLs that we don't have explicit
                  routes for. */}
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </div>
    );
}

const range = (start: number, end: number): number[] => {
    const items: number[] = [];
    for (let i = start; i <= end; i++) {
        items.push(i);
    }
    return items;
};

function Layout() {
    return (
        <div className={styles.appGrid}>
            <div className={styles.appHeader}>
                <h1>Advent of Code 2022</h1>
            </div>
            {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
            <nav className={styles.appNav}>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {range(1, 25).map(i => {
                        return (
                            <li key={`$list${i}`}>
                                <Link to={`/day${i}`}>Day {i}</Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.appPage}>
                <hr />
                {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
                <Outlet />
            </div>
        </div>
    );
}

function Home() {
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
}

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
}
