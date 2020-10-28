import React from "react";
import ReactDOM from "react-dom";

const Header = ({ course }) => <h1>{course}</h1>;

const Part = ({ name, exerciseCount }) => (
  <p>
    {name} {exerciseCount}
  </p>
);

const Content = ({ parts }) => parts.map((part) => <Part name={part.name} exerciseCount={part.exercises} />);
const Total = ({ parts }) => <p>Number of exercises {parts.reduce((total, current) => total + current.exercises, 0)}</p>;

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
