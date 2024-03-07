import React, {useState, useEffect} from 'react';
import { Table } from 'react-bootstrap';
import { usePatientContext } from './PatientProvider';

export default function PatientPicker(props) {
  const { client } = props;
  const { setPatientId } = usePatientContext();

  const [patients, setPatients] = useState([])

  useEffect(() => {
    client?.request("Patient")
    .then((bundle) => {
      setPatients(bundle.entry.map(e => e.resource) ?? [])
    })
    .catch(err => {
      console.error(err);
      setPatients([])
    })
  }, [client])

  return (
    <Table hover size="ml">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Full Name</th>
          <th>ID</th>
          <th>DOB</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(p => <tr key={p.id} onClick={() => setPatientId(p.id)}>
          <td>{p.name[0].given[0]}</td>
          <td>{p.name[0].text}</td>
          <td>{p.id}</td>
          <td>{p.birthDate}</td>
        </tr>)}
      </tbody>
    </Table>
  );
};
