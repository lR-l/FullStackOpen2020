import React from "react";

const Header = ({ course }) => <h2>{course}</h2>;

const Part = ({ name, exerciseCount }) => (
  <p>
    {name} {exerciseCount}
  </p>
);

const Content = ({ parts }) => parts.map((part) => <Part key={part.id} name={part.name} exerciseCount={part.exercises} />);
const Total = ({ parts }) => <p style={{ fontWeight: "bold" }}>total of {parts.reduce((total, current) => total + current.exercises, 0)} exercises</p>;

const Course = ({ course }) => (
  <>
    <Header course={course.name}></Header>
    <Content parts={course.parts}></Content>
    <Total parts={course.parts}></Total>
  </>
);

export default Course;
