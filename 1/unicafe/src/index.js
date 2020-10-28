import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;
const StatisticsLine = ({ text, value, decimals, percent }) => (
  <tr>
    <td>{text}:</td>
    <td>
      {decimals ? value.toFixed(1) : value}
      {percent ? "%" : ""}
    </td>
  </tr>
);
const Statistics = ({ good, neutral, bad, total, average, positive }) =>
  total ? (
    <table>
      <tbody>
        <StatisticsLine text="Good" value={good}></StatisticsLine>
        <StatisticsLine text="Neutral" value={neutral}></StatisticsLine>
        <StatisticsLine text="Bad" value={bad}></StatisticsLine>
        <StatisticsLine text="Total" value={total}></StatisticsLine>
        <StatisticsLine text="Average" value={average} decimals></StatisticsLine>
        <StatisticsLine text="Positive" value={positive} decimals percent></StatisticsLine>
      </tbody>
    </table>
  ) : (
    <span>No feedback given</span>
  );

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const total = good + neutral + bad;
  const average = total ? (good * 1 + bad * -1) / total : 0;
  const positive = total ? (good / total) * 100 : 0;

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="Good" onClick={() => setGood(good + 1)}></Button>
      <Button text="Neutral" onClick={() => setNeutral(neutral + 1)}></Button>
      <Button text="Bad" onClick={() => setBad(bad + 1)}></Button>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive}></Statistics>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
