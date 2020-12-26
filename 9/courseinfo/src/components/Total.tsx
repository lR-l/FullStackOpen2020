import React from "react";

interface Course {
  name: string;
  exerciseCount: number;
}

interface TotalProps {
  parts: Array<Course>;
}

const Total: React.FC<TotalProps> = (props) => {
  return <p>Number of exercises {props.parts.reduce((carry, part) => carry + part.exerciseCount, 0)}</p>;
};

export default Total;
