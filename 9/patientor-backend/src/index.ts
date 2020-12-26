import express from "express";
import diagnoseRouter from "./routes/diagnoseRouter";
import patientRouter from "./routes/patientRouter";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("Server pinged");
  res.send("PLING!");
});

app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
