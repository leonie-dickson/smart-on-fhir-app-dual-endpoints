import React,{useEffect,useState} from 'react';
import './App.css';
import {ConditionsVisualizer, MedicationRequestVisualizer, ObservationsVisualizer, PatientVisualizer, ServiceRequestVisualizer} from 'fhir-visualizers';
// import { useForm } from "react-hook-form";
import {Spinner, Container} from "react-bootstrap";

const obsValue = (entry) => {
  if (entry == null) {
    return '';
  } else if (entry.valueQuantity) {
    return Math.round(entry.valueQuantity.value, 2) + (entry.valueQuantity.unit ? ' ' + entry.valueQuantity.unit : "");
  } else if (entry.valueCodeableConcept) {
    return entry.valueCodeableConcept.coding && entry.valueCodeableConcept.coding[0].display ? entry.valueCodeableConcept.coding[0].display : entry.valueCodeableConcept.text;
  } else if (entry.valueString) {
    return entry.valueString;
  } else if (entry.valueDateTime) {
    return entry.valueDateTime
  }
}

const formatCodeableConcept = (cc) => {
  let coding = cc.coding ? cc.coding[0] : undefined;
  if (coding) {
    return `${coding.code}: ${coding.display}`
  }
  return cc.text
}

export default function App(props) {
  const { client } = props;
  const [patient, setPatient] = useState(null);
  const [obs, setObs] = useState(null);
  const [sReqs, setSReqs] = useState(null);
  const [conds, setConds] = useState(null);
  const [medReqs, setMedReqs] = useState(null);

  useEffect(() => {
    client?.patient.read().then((patient) => setPatient(patient));

    if (client.patient.id) {
      client.request(`Patient/${client.patient.id}/$everything`)
      .then((bundle) => {
        setObs(bundle.entry?.map(e => e.resource).filter(o => o.resourceType === "Observation" && obsValue(o) !== undefined));
        setSReqs(bundle.entry?.map(e => e.resource).filter(s => s.resourceType === "ServiceRequest"));
        setConds(bundle.entry?.map(e => e.resource).filter(c => c.resourceType === "Condition"));
        setMedReqs(bundle.entry?.map(e => e.resource).filter(s => s.resourceType === "MedicationRequest"));
        console.log(bundle.entry?.map(e => e.resource).filter(s => s.resourceType === "MedicationRequest"))
      })
      .catch(console.error)
    }
  }, [client]);

  let pat=patient?
  <PatientVisualizer patient={patient} />
  : <Spinner animation='border'/>;

  return (
    <div className="app">
      <Container>{client ? <h6>{client.state.serverUrl}</h6> : null}</Container>
      <Container>
        {pat}
      </Container>
      <Container>
        { conds && conds.length ? 
          <ConditionsVisualizer rows={conds} columns={[
            { title: 'Condition', versions: '*', getter: c => formatCodeableConcept(c.code) },
            { title: 'Date of Onset', versions: '*', format: 'date', getter: c => c.onsetDateTime },
            { title: 'Status', versions: '*', getter: c => c.clinicalStatus.text },
            { title: 'Recorded Date', versions: '*', format: 'date', getter: c => c.recordedDate }
          ]} />
        : null}
      </Container>
      <Container>
        { medReqs && medReqs.length ? 
          <MedicationRequestVisualizer rows={medReqs} columns={[
            { title: 'Medication', versions: '*', getter: m => formatCodeableConcept(m.contained[0].code) },
            { title: 'Dosage Instruction', versions: '*', getter: m => m.dosageInstruction[0].text},
            { title: 'Dosage Timing', versions: '*', format: 'period', getter: m => m.dosageInstruction[0].timing.repeat.boundsPeriod},
            { title: 'Author Date', versions: '*', format: 'date', getter: m => m.authoredOn },
            { title: 'Reason', versions: '*', getter: m => formatCodeableConcept(m.reasonCode[0]) }
          ]} />
        : null}
      </Container>
      <Container>
        {obs && obs.length ? <ObservationsVisualizer rows={obs} 
            columns={[
            { title: 'Observation', versions: '*', getter: o => formatCodeableConcept(o.code) },
            { title: 'Category', versions: '*', getter: o => {
              if (!o.category[0].coding || !o.category[0].coding[0]) {
                return o.category[0].text
              }
              return o.category[0].coding[0].display
             } },
            { title: 'Value', versions: '*', getter: o => obsValue(o) },
            { title: 'Effective', 'versions': '*', format: 'dateTime', getter: o => o.effectiveDateTime },
            { title: 'ID', versions: '*', getter: o => o.id }
          ]}
        /> : null}
      </Container>
      <Container>
        { sReqs && sReqs.length ? 
          <ServiceRequestVisualizer rows={sReqs} columns={[
            { title: 'Service', versions: '*', getter: s => formatCodeableConcept(s.code) },
            { title: 'Author Date', versions: '*', format: 'date', getter: s => s.authoredOn },
            { title: 'Status', versions: '*', getter: s => s.status },
            { title: 'Reason', versions: '*', format: 'code', getter: s => s.reasonCode[0].coding[0] },
            { title: 'ID', versions: '*', getter: s => s.id },
            { title: 'Do Not Perform', versions: '*', getter: s => s.doNotPerform },
          ]} />
        : null}
      </Container>
    </div>
  );
};

