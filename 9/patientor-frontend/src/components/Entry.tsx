import React from "react";
import { Item, Icon } from "semantic-ui-react";
import { useStateValue } from "../state";
import { DischargeInfo, Entry, SickLeave } from "../types";

const assertNever = (entry: never): never => {
  throw new Error(`Unhandled type entry: ${JSON.stringify(entry)}`);
};

const HealthCheckRating = (rating: number) => {
  switch (rating) {
    case 0:
      return <Icon name="heart" color="green"></Icon>;
    case 1:
      return <Icon name="heart" color="yellow"></Icon>;
    case 2:
      return <Icon name="heart" color="orange"></Icon>;
    case 3:
      return <Icon name="heart" color="red"></Icon>;
    default:
      return null;
  }
};

const DischargeDetails = (discharge: DischargeInfo) => {
  return (
    <>
      <h3>{discharge.date} Discharged</h3>
      <p>{discharge.criteria}</p>
    </>
  );
};

const SickLeaveDetails = (sickLeave: SickLeave) => {
  return (
    <>
      <h3>Sick leave</h3>
      <p>From: {sickLeave.startDate}</p>
      <p>To: {sickLeave.endDate}</p>
    </>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoseData }] = useStateValue();

  switch (entry.type) {
    case "HealthCheck":
      return (
        <Item>
          <Item.Image>
            <Icon name="heartbeat" size="huge" bordered></Icon>
          </Item.Image>
          <Item.Content verticalAlign="middle">
            <Item.Header>{entry.date}</Item.Header>
            <Item.Description>
              <p>{entry.description}</p>
              {entry.diagnosisCodes?.map((diagnosisCode: string) => {
                return (
                  <p>
                    {diagnosisCode}
                    {diagnoseData[diagnosisCode] ? ` ${diagnoseData[diagnosisCode].name}` : null}
                  </p>
                );
              })}
              <Item.Extra>{HealthCheckRating(entry.healthCheckRating)}</Item.Extra>
            </Item.Description>
          </Item.Content>
        </Item>
      );
    case "OccupationalHealthcare":
      return (
        <Item>
          <Item.Image>
            <Icon name="user md" size="huge" bordered></Icon>
          </Item.Image>
          <Item.Content verticalAlign="middle">
            <Item.Header>{entry.date}</Item.Header>
            <Item.Meta>{entry.employerName}</Item.Meta>
            <Item.Description>
              <p>{entry.description}</p>
              <ul>
                {entry.diagnosisCodes?.map((diagnosisCode: string) => {
                  return <li key={diagnosisCode}>{diagnoseData[diagnosisCode] ? ` ${diagnoseData[diagnosisCode].name}` : null}</li>;
                })}
              </ul>
              {entry?.sickLeave ? SickLeaveDetails(entry.sickLeave) : null}
            </Item.Description>
          </Item.Content>
        </Item>
      );
    case "Hospital":
      return (
        <Item>
          <Item.Image>
            <Icon name="hospital" size="huge" bordered></Icon>
          </Item.Image>
          <Item.Content verticalAlign="middle">
            <Item.Header>{entry.date}</Item.Header>
            <Item.Meta></Item.Meta>
            <Item.Description>
              <ul>
                {entry.diagnosisCodes?.map((diagnosisCode: string) => {
                  return <li key={diagnosisCode}>{diagnoseData[diagnosisCode] ? ` ${diagnoseData[diagnosisCode].name}` : null}</li>;
                })}
              </ul>
              <p>{entry.description}</p>
              {entry?.discharge ? DischargeDetails(entry.discharge) : null}
            </Item.Description>
          </Item.Content>
        </Item>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
