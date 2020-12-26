import React from "react";

import { CoursePart } from "../types";

const assertNever = (part: never): never => {
  throw new Error(`Unhandled type part: ${JSON.stringify(part)}`);
};

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
  switch (part.name) {
    case "Fundamentals":
      return (
        <>
          <p>{`${part.name} - ${part.description}. Exercises: ${part.exerciseCount}`}</p>
        </>
      );
    case "Using props to pass data":
      return (
        <>
          <p>{`${part.name}. Group projects: ${part.groupProjectCount} Exercises: ${part.exerciseCount}`}</p>
        </>
      );
    case "Deeper type usage":
      return (
        <>
          <p>{`${part.name} - ${part.description}. Submission link: ${part.exerciseSubmissionLink} Exercises: ${part.exerciseCount}`}</p>
        </>
      );
    case "Teaching dogs to code":
      return (
        <>
          <p>{`${part.name} - ${part.description}. Entry fee: ${part.entryFee}${part.currency} Exercises: ${part.exerciseCount}`}</p>
        </>
      );

    default:
      return assertNever(part);
  }
};

export default Part;
