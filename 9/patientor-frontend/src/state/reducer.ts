import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT_DATA";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSE_DATA";
      payload: Diagnosis[];
    }
  | {
      type: "UPDATE_PATIENT_DATA";
      payload: Patient;
    };

export const setPatientList = (patients: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patients,
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient,
  };
};

export const addPatientData = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT_DATA",
    payload: patient,
  };
};

export const setDiagnoseData = (diagnoses: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSE_DATA",
    payload: diagnoses,
  };
};

export const updatePatientData = (patient: Patient): Action => {
  return {
    type: "UPDATE_PATIENT_DATA",
    payload: patient,
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce((memo, patient) => ({ ...memo, [patient.id]: patient }), {}),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "ADD_PATIENT_DATA":
      return {
        ...state,
        patientData: {
          ...state.patientData,
          [action.payload.id]: action.payload,
        },
      };
    case "SET_DIAGNOSE_DATA":
      return {
        ...state,
        diagnoseData: {
          ...action.payload.reduce((memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }), {}),
          ...state.diagnoseData,
        },
      };
    case "UPDATE_PATIENT_DATA":
      return {
        ...state,
        patientData: {
          ...state.patientData,
          [action.payload.id]: action.payload,
        },
      };
    default:
      return state;
  }
};
