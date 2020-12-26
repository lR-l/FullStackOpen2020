import React from "react";
import axios from "axios";
import { Button, Icon, Item } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { addPatientData, updatePatientData, useStateValue } from "../state";
import { useParams } from "react-router-dom";
import EntryDetails from "../components/Entry";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientPage: React.FC = () => {
  const [{ patientData }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const currentPatient = patientData[id];

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(`${apiBaseUrl}/patients/${id}/entries`, values);
      dispatch(updatePatientData(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const renderEntries = () => {
    if (currentPatient.entries.length > 0) {
      return (
        <Item.Group>
          {currentPatient.entries.map((entry) => (
            <EntryDetails key={entry.id} entry={entry}></EntryDetails>
          ))}
        </Item.Group>
      );
    } else {
      return null;
    }
  };

  React.useEffect(() => {
    if (!patientData[id]) {
      const fetchPatient = async () => {
        try {
          const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
          dispatch(addPatientData(patientFromApi));
        } catch (e) {
          console.error(e);
        }
      };
      fetchPatient();
    }
  }, [dispatch, id, patientData]);

  if (!currentPatient) {
    return null;
  }
  return (
    <div>
      <h1>
        {currentPatient.name} <Icon name={currentPatient.gender === "male" ? "mars" : currentPatient.gender === "female" ? "venus" : "transgender alternate"} />
      </h1>
      <p>ssn: {currentPatient.ssn}</p>
      <p>occupation: {currentPatient.occupation}</p>
      <h3>entries</h3>
      {renderEntries()}
      <AddEntryModal modalOpen={modalOpen} onSubmit={submitNewEntry} error={error} onClose={closeModal} />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientPage;
