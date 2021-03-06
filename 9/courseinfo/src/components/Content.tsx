import React from "react";
import { CoursePart } from "../types";
import Part from "./Part";

const Content: React.FC<{ parts: CoursePart[] }> = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <>
          <Part part={part}></Part>
        </>
      ))}
    </>
  );
};

export default Content;
