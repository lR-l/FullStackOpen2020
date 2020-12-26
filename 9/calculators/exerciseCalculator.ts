interface exerciseData {
  days: number;
  trainingDays: number;
  averageHours: number;
  targetDailyHours: number;
  targetReached: boolean;
  rating: number;
  ratingDescription: string;
}

interface ratingData {
  rating: number;
  ratingDescription: string;
}

const calculateRating = (success: boolean, trainingValue: number): ratingData => {
  if (success) {
    if (trainingValue >= 1.5) {
      return {
        rating: 3,
        ratingDescription: "Great success!",
      };
    } else if (trainingValue > 0.5 && trainingValue < 1.5) {
      return {
        rating: 2,
        ratingDescription: "You did good.",
      };
    }
    return {
      rating: 1,
      ratingDescription: "Achievement unlocked",
    };
  } else {
    if (trainingValue >= -0.5) {
      return {
        rating: 2,
        ratingDescription: "You almost made it",
      };
    } else if (trainingValue <= -2) {
      return {
        rating: 1,
        ratingDescription: "Major disappointment",
      };
    }
    return {
      rating: 3,
      ratingDescription: "Epic fail! Better luck next time... (there won't be a next time)",
    };
  }
};

type NumberArray = Array<number>;

export const calculateExercises = (dailyExerciseHours: NumberArray, targetDailyExerciseHours: number): exerciseData => {
  if (!dailyExerciseHours.every((hours) => hours >= 0) || targetDailyExerciseHours < 0) {
    throw new Error("Invalid input values");
  }

  const trainingDays = dailyExerciseHours.filter((dailyHours) => dailyHours > 0).length;
  const averageHours = dailyExerciseHours.reduce((total, currentValue) => total + currentValue, 0) / dailyExerciseHours.length;
  const targetReached = averageHours >= targetDailyExerciseHours;
  const trainingValue = averageHours - targetDailyExerciseHours;
  const { rating, ratingDescription } = calculateRating(targetReached, trainingValue);

  return {
    days: dailyExerciseHours.length,
    trainingDays,
    averageHours,
    targetDailyHours: targetDailyExerciseHours,
    targetReached,
    rating,
    ratingDescription,
  };
};

/* commented for node server

interface exerciseDataInput {
  dailyExerciseHours: NumberArray;
  targetDailyExerciseHours: number;
}

const processExerciseInput = (args: Array<string>): exerciseDataInput => {
  if (args.length < 2) {
    throw new Error("Invalid amount of input values");
  }
  const [targetDailyExerciseHours, ...dailyExerciseHours] = args;

  if (
    !isNaN(Number(targetDailyExerciseHours)) &&
    Number(targetDailyExerciseHours) >= 0 &&
    dailyExerciseHours.every((dailyHours) => !isNaN(Number(dailyHours)) && Number(dailyHours) >= 0)
  ) {
    return {
      targetDailyExerciseHours: Number(targetDailyExerciseHours),
      dailyExerciseHours: dailyExerciseHours.map((dailyHours) => Number(dailyHours)),
    };
  } else {
    throw new Error("Invalid input values");
  }
};

try {
  const [, , ...args] = process.argv;
  const { targetDailyExerciseHours, dailyExerciseHours } = processExerciseInput(args);
  console.log(calculateExercises(dailyExerciseHours, targetDailyExerciseHours));
  //console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
} catch (error) {
  console.log(error);
}
*/
