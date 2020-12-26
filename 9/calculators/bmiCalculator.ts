export const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0) {
    return "Invalid height";
  }

  if (weight <= 0) {
    return "Invalid weight";
  }

  const bmi = weight / (2 * (height / 100));
  switch (true) {
    case bmi < 15:
      return "Very severely underweight";
    case bmi >= 15 && bmi < 16:
      return "Severely underweight";
    case bmi >= 16 && bmi < 18.5:
      return "Underweight";
    case bmi >= 18.5 && bmi < 25:
      return "Normal (healthy weight)";
    case bmi >= 25 && bmi < 30:
      return "Overweight";
    case bmi >= 30 && bmi < 35:
      return "Obese Class I (Moderately obese)";
    case bmi >= 35 && bmi < 40:
      return "Obese Class II (Severely obese)";
    case bmi >= 40:
      return "Obese Class III (Very severely obese)";
    default:
      return "Invalid bmi";
  }
};
/* commented for node server
interface bmiValues {
  height: number;
  weight: number;
}

const processInput = (args: Array<string>): bmiValues => {
  if (args.length !== 2) {
    throw new Error("Invalid amount of input values");
  }

  if (!isNaN(Number(args[0])) && !isNaN(Number(args[1])) && Number(args[0]) > 0 && Number(args[1]) > 0) {
    return {
      height: Number(args[0]),
      weight: Number(args[1]),
    };
  } else {
    throw new Error("Invalid input values");
  }
};

try {
  const [, , ...args] = process.argv;
  const { height, weight } = processInput(args);
  console.log(calculateBmi(height, weight));
  //console.log(calculateBmi(180, 74));
} catch (error) {
  console.log(error);
}
*/
