import { NewPatientEntry, PublicPatient, Patient, NewEntry } from "../types";
import patientData from "../../data/patients";
import { v4 as uuid4 } from "uuid";

const patients: Array<PublicPatient> = patientData;
const allPatients: Array<Patient> = patientData;

const getEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getEntry = (id: string): Patient | undefined => {
  return allPatients.find((patient) => patient.id === id);
};

const addEntry = (newEntry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid4(),
    ...newEntry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const updateEntry = (id: string, entry: NewEntry): Patient | null => {
  const patient = allPatients.find((patient: Patient) => patient.id === id);
  if (patient) {
    const newEntry = {
      id: uuid4(),
      ...entry,
    };
    patient.entries.push(newEntry);
    return patient;
  } else {
    return null;
  }
};

export default {
  getEntries,
  addEntry,
  getEntry,
  updateEntry,
};
