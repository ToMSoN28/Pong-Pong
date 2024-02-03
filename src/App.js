import { useEffect, useState } from "react";
import "./styles.css";

function Field() {
  return (
    <table className="field">
      <tbody>
        <tr>
          <td className="tl"></td>
          <td className="tr"></td>
        </tr>
        <tr>
          <td className="ml"></td>
          <td></td>
        </tr>
        <tr>
          <td className="ml"></td>
          <td></td>
        </tr>
        <tr>
          <td className="bl"></td>
          <td className="br"></td>
        </tr>
      </tbody>
    </table>
  );
}

function Paddle({ x, y }) {
  return (
    <div
      className="paddle"
      style={{
        left: x,
        top: y
      }}
    ></div>
  );
}

function Timer({ numer, pause }) {
  let [counter, setCounter] = useState(0);
  let [lastGame, setLastGame] = useState(-1);
  let min = parseInt(counter / 60);
  let sec = counter % 60;
  // console.log(numer);
  if (lastGame !== numer) {
    setCounter(0);
    setLastGame(numer);
  }

  useEffect(() => {
    let i = setTimeout(() => {
      if (pause === 0) setCounter(counter + 1);
    }, 1000);
    return () => {
      clearTimeout(i);
    };
  }, [counter, pause]);

  return (
    <div className="timer">
      Time: {min} m {sec} s
    </div>
  );
}

function Controls({ left, right, onRestart, onPause }) {
  return (
    <div className="controls">
      <button style={{ float: "left" }} onClick={onPause}>
        Pause
      </button>
      <span style={{ float: "bottom", height: "30px" }}>
        {left} : {right}
      </span>
      <button style={{ float: "right" }} onClick={onRestart}>
        Restart
      </button>
      <p>Q A: moveing left paddle</p>
      <p>P L: moveing right paddle</p> 
    </div>
  );
}

function Ball({ x, y }) {
  return <div className="ball" style={{ left: x, top: y }}></div>;
}

export default function App() {
  let [rightY, setRightY] = useState(100);
  let [leftY, setLeftY] = useState(100);
  let [numerGry, setNumerGry] = useState(0);
  let [x, setX] = useState(100);
  let [y, setY] = useState(100);
  let [dx, setDX] = useState(2);
  let [dy, setDY] = useState(2);
  let [rightPoint, setRightPoint] = useState(0);
  let [leftPoint, setLeftPoint] = useState(0);
  let [pause, setPause] = useState(0);

  useEffect(() => {
    let klawisz = (event) => {
      // L-76
      // P-80
      // A-65
      // Q-81
      // console.log(event.which);
      if (pause === 0) {
        if (event.which === 76) setRightY(rightY + 8);
        if (event.which === 80) setRightY(rightY - 8);
        if (event.which === 65) setLeftY(leftY + 8);
        if (event.which === 81) setLeftY(leftY - 8);
      }
    };

    document.addEventListener("keydown", klawisz);

    return () => {
      document.removeEventListener("keydown", klawisz);
    };
  }, [rightY, leftY, pause]);

  useEffect(() => {
    let t = setTimeout(() => {
      x = x + dx;
      y = y + dy;

      if (x < 10 && Math.abs(leftY + 5 - y) < 20) {
        // console.log("odbijam lewą");
        if (dx < 0) setDX(-dx);
        x += 3;
      }

      if (x > 370 && Math.abs(rightY + 5 - y) < 20) {
        // console.log("odbijam prawą");
        if (dx > 0) setDX(-dx);
        x -= 3;
      }

      if (rightY > 278) setRightY(278);
      if (rightY < 18) setRightY(18);
      if (leftY > 278) setLeftY(278);
      if (leftY < 18) setLeftY(18);

      if (x > 380 && dx > 0) setDX(-dx);
      if (x < 0 && dx < 0) setDX(-dx);
      if (y > 295) setDY(-dy);
      if (y < 20) setDY(-dy);

      if (x > 380 && Math.abs(y - 145) < 75) setLeftPoint(leftPoint + 1);
      if (x < 0 && Math.abs(y - 145) < 75) setRightPoint(rightPoint + 1);

      if (pause === 0) {
        setX(x);
        setY(y);
      }
    }, 15);
  }, [x, y, leftY, rightY, dx, dy, leftPoint, rightPoint, pause]);

  let onRestart = () => {
    setNumerGry(numerGry + 1);
    setLeftPoint(0);
    setRightPoint(0);
  };

  let onPause = () => {
    // console.log(pause);
    if (pause === 1) {
      setPause(0);
      console.log("start");
    } else {
      setPause(1);
      console.log("pause");
    }
  };

  return (
    <div className="App">
      <div className="fieldContainer">
        <Timer numer={numerGry} pause={pause} />
        <Field />
        <Paddle x="5px" y={leftY} />
        <Paddle x="385px" y={rightY} />
        <Controls
          left={leftPoint}
          right={rightPoint}
          onRestart={onRestart}
          onPause={onPause}
        />
        <Ball x={x} y={y} />
      </div>
    </div>
  );
}
