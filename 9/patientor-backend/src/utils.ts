import { NewPatientEntry, Gender, Entry, NewEntry, DiagnoseEntry, DischargeInfo, HealthCheckRating, SickLeave } from "./types";
/* eslint-disable @typescript-eslint/no-explicit-any */

const isString = (input: any): input is string => {
  return typeof input === "string" || input instanceof String;
};

const isDate = (input: string): boolean => {
  return Boolean(Date.parse(input));
};

const isGender = (input: any): input is Gender => {
  return Object.values(Gender).includes(input);
};

const isType = (input: any): input is Entry["type"] => {
  const types: string[] = ["Hospital", "HealthCheck", "OccupationalHealthcare"];
  return types.includes(input);
};

const isEntryArray = (input: any): input is Entry[] => {
  return (
    Array.isArray(input) &&
    input.every((entry: any) => {
      return isType(entry.type); /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */
    })
  );
};

const isDiagnosisCodeArray = (input: any): input is Array<DiagnoseEntry["code"]> => {
  return Array.isArray(input) && input.every((code: any) => isString(code));
};

const isDischargeInfo = (input: any): input is DischargeInfo => {
  if ("date" in input && "criteria" in input) {
    return isString(input.date) && isString(input.criteria); /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */
  }
  return false;
};

const isHealthCheckRating = (input: any): input is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(input);
};

const isSickLeave = (input: any): input is SickLeave => {
  if ("startDate" in input && "endDate" in input) {
    return isString(input.startDate) && isString(input.endDate); /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */
  }
  return false;
};

const parseDateOfBirth = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Invalid date");
  }

  return date;
};

const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error("Invalid name");
  }

  return name;
};

const parseSSN = (ssn: any): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Invalid ssn");
  }

  return ssn;
};

const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Invalid occupation");
  }

  return occupation;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Invalid gender");
  }

  return gender;
};

const parseEntries = (entries: any): Entry[] => {
  if (!isEntryArray(entries)) {
    throw new Error("Invalid entries");
  }

  return entries;
};

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export const toNewPatientEntry = (object: any): NewPatientEntry => {
  return {
    name: parseName(object.name) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    dateOfBirth: parseDateOfBirth(object.dateOfBirth) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    ssn: parseSSN(object.ssn) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    gender: parseGender(object.gender) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    occupation: parseOccupation(object.occupation) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    entries: parseEntries(object.entries) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
  };
};

const parseDescription = (description: any): string => {
  if (!description || !isString(description)) {
    throw new Error("Invalid description");
  }
  return description;
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Invalid date");
  }

  return date;
};

const parseSpecialist = (specialist: any): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("Invalid specialist");
  }

  return specialist;
};

const parseDiagonisisCodes = (diagnosisCodes: any): Array<DiagnoseEntry["code"]> => {
  if (!diagnosisCodes || !isDiagnosisCodeArray(diagnosisCodes)) {
    throw new Error("Invalid diagonisis codes");
  }

  return diagnosisCodes;
};

const parseType = (type: any): string => {
  if (!type || !isType(type)) {
    throw new Error("Invalid type");
  }
  return type;
};

const parseDischarge = (discharge: any): DischargeInfo => {
  if (!discharge || !isDischargeInfo(discharge)) {
    throw new Error("Invalid discharge info");
  }

  return discharge;
};

const parseHealthCheckRating = (healthCheckRating: any): HealthCheckRating => {
  if (healthCheckRating === undefined || !isHealthCheckRating(healthCheckRating)) {
    throw new Error("Invalid healthcheck rating");
  }

  return healthCheckRating;
};

const parseEmployerName = (employerName: any): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error("Invalid employer name");
  }

  return employerName;
};

const parseSickLeave = (sickLeave: any): SickLeave => {
  if (!sickLeave || !isSickLeave(sickLeave)) {
    throw new Error("Invalid sick leave");
  }

  return sickLeave;
};

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export const toNewEntry = (object: any): NewEntry => {
  const baseEntry = {
    description: parseDescription(object.description) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    date: parseDate(object.date) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    specialist: parseSpecialist(object.specialist) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
    diagnosisCodes: parseDiagonisisCodes(object.diagnosisCodes) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
  };

  const type = parseType(object.type); /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */

  switch (type) {
    case "Hospital":
      return {
        ...baseEntry,
        type,
        discharge: parseDischarge(object.discharge) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
      };
    case "HealthCheck":
      return {
        ...baseEntry,
        type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
      };
    case "OccupationalHealthcare":
      return {
        ...baseEntry,
        type,
        employerName: parseEmployerName(object.employerName) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
        sickLeave: parseSickLeave(object.sickLeave) /* eslint-disable-line @typescript-eslint/no-unsafe-member-access */,
      };
    default:
      throw Error("Invalid entry type");
  }
};
