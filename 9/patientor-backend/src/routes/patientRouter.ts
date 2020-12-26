import express from "express";
import patientService from "../services/patientService";
import { toNewEntry, toNewPatientEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getEntries());
});

router.get("/:id", (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error("Invalid patient id");
    }
    const patient = patientService.getEntry(req.params.id);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).send("Patient not found");
    }
  } catch ({ message }) {
    res.status(400).send(message);
  }
});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const newPatient = patientService.addEntry(newPatientEntry);
    res.json(newPatient);
  } catch ({ message }) {
    res.status(400).send(message);
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error("Invalid patient id");
    }
    const newEntry = toNewEntry(req.body);
    const updatedPatient = patientService.updateEntry(req.params.id, newEntry);
    if (updatedPatient) {
      res.json(updatedPatient);
    } else {
      res.status(404).send("Patient not found");
    }
  } catch ({ message }) {
    res.status(400).send(message);
  }
});

export default router;
