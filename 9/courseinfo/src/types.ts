export interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

export interface CoursePartBaseWithDescription extends CoursePartBase {
  description: string;
}

export interface CoursePartOne extends CoursePartBaseWithDescription {
  name: "Fundamentals";
}

export interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

export interface CoursePartThree extends CoursePartBaseWithDescription {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

export interface CoursePartFour extends CoursePartBaseWithDescription {
  name: "Teaching dogs to code";
  entryFee: number;
  currency: string;
}

export type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CoursePartFour;
