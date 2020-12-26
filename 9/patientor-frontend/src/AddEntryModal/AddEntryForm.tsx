import React, { useState } from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, DiagnosisSelection, TypeSelectField, EntryOption, NumberField } from "../AddPatientModal/FormField";
import { HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry, EntryType } from "../types";
import { useStateValue } from "../state";

export type EntryFormValues = Omit<HospitalEntry, "id"> | Omit<HealthCheckEntry, "id"> | Omit<OccupationalHealthcareEntry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryTypeOptions: EntryOption[] = [
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.HealthCheck, label: "HealthCheck" },
  { value: EntryType.OccupationalHealthcare, label: "OccupationalHealthcare" },
];

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoseData }] = useStateValue();
  const [type, setType] = useState("Hospital");

  const renderTypeFields = () => {
    if (type === EntryType.Hospital) {
      return (
        <>
          <Field label="Discharge date" placeholder="YYYY-MM-DD" name="discharge.date" component={TextField} />
          <Field label="Criteria" placeholder="Criteria" name="discharge.criteria" component={TextField} />
        </>
      );
    } else if (type === EntryType.HealthCheck) {
      return <Field label="Health rating" name="healthCheckRating" min={0} max={3} required component={NumberField} />;
    } else {
      return (
        <>
          <Field label="Employer name" placeholder="Emplyer name" name="employerName" component={TextField} />
          <Field label="Sick leave start date" placeholder="YYYY-MM-DD" name="sickLeave.startDate" component={TextField} />
          <Field label="Sick leave end date" placeholder="YYYY-MM-DD" name="sickLeave.endDate" component={TextField} />
        </>
      );
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={
        type === EntryType.Hospital
          ? {
              type: "Hospital" || "",
              description: "",
              date: "",
              specialist: "",
              diagnosisCodes: [],
              discharge: {
                date: "",
                criteria: "",
              },
            }
          : type === EntryType.HealthCheck
          ? {
              type: "HealthCheck",
              description: "",
              date: "",
              specialist: "",
              diagnosisCodes: [],
              healthCheckRating: 0,
            }
          : {
              type: "OccupationalHealthcare",
              description: "",
              date: "",
              specialist: "",
              diagnosisCodes: [],
              employerName: "",
              sickLeave: {
                startDate: "",
                endDate: "",
              },
            }
      }
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const valueError = "Value has incorrect format or is invalid";
        const errors: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

        if (!values.description) {
          errors.description = requiredError;
        }
        if (values.date) {
          if (!Date.parse(values.date)) {
            errors.date = valueError;
          }
        } else {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        switch (values.type) {
          case "Hospital":
            if (values.discharge.date) {
              if (!Date.parse(values.discharge.date)) {
                errors.discharge = { ...errors.discharge, date: valueError };
              }
            } else {
              errors.discharge = { ...errors.discharge, date: requiredError };
            }
            if (!values.discharge.criteria) {
              errors.discharge = { ...errors.discharge, criteria: requiredError };
            }

            break;

          case "HealthCheck":
            if (values.healthCheckRating || values.healthCheckRating === 0) {
              if (isNaN(values.healthCheckRating) || values.healthCheckRating < 0 || values.healthCheckRating > 3) {
                errors.healthCheckRating = valueError;
              }
            } else {
              errors.healthCheckRating = requiredError;
            }
            break;

          case "OccupationalHealthcare":
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
            if (values.sickLeave?.startDate) {
              if (!Date.parse(values.sickLeave?.startDate)) {
                errors.sickLeave = { ...errors.sickLeave, startDate: valueError };
              }
            }
            if (values.sickLeave?.endDate) {
              if (!Date.parse(values.sickLeave?.endDate)) {
                errors.sickLeave = { ...errors.sickLeave, endDate: valueError };
              }
            }
            break;
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, setErrors }) => {
        return (
          <Form className="form ui">
            <TypeSelectField label="Type" name="type" options={entryTypeOptions} setType={setType} setErrors={setErrors} />
            <Field label="Description" placeholder="Description" name="description" component={TextField} />
            <Field label="Date" placeholder="YYYY-MM-DD" name="date" component={TextField} />
            <Field label="Specialist" placeholder="Specialist" name="specialist" component={TextField} />
            <DiagnosisSelection setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} diagnoses={Object.values(diagnoseData)} />
            {renderTypeFields()}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button type="submit" floated="right" color="green" disabled={!dirty || !isValid}>
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
