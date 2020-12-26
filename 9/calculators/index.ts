import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  if (req.query.weight && req.query.height) {
    const weight = Number(req.query.weight);
    const height = Number(req.query.height);

    if (!isNaN(weight) && weight > 0 && !isNaN(height) && height > 0) {
      res.json({
        weight,
        height,
        bmi: calculateBmi(height, weight),
      });
    } else {
      res.status(400).send("Invalid parameters");
    }
  } else {
    res.status(400).send("Missing parameters");
  }
});

app.post("/exercises", (req, res) => {
  const targetHourParam: number = req.body?.target || null; // eslint-disable-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const dailyHourParam: Array<number> = req.body?.daily_exercises || null; // eslint-disable-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  if (targetHourParam && dailyHourParam) {
    const targetHours = Number(targetHourParam);
    const dailyHours = dailyHourParam.map((hours: number) => Number(hours)) || null;

    if (!isNaN(targetHours) && targetHours >= 0 && dailyHours.every((hours) => !isNaN(hours) && hours >= 0)) {
      res.json(calculateExercises(dailyHours, targetHours));
    } else {
      res.status(400).send("Invalid parameters");
    }
  } else {
    res.status(400).send("Missing parameters");
  }
});

const PORT = "3001";
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
