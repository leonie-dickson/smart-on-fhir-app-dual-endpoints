import React from 'react';
import './AppWrapper.css';
import { useLoaderData } from 'react-router-dom';
import App from './App';
import PatientPicker from './PatientPicker';
import PatientProvider, { usePatientContext } from './PatientProvider';

export default function AppWrapper() {
  const { clientA, clientB } = useLoaderData();
  const patientContextA = usePatientContext();
  const patientIdA = patientContextA.patientId;

  return (
    <div className="app-wrapper">
      <div className='app-wrapper-col'>
          {
            patientIdA ?
              <App client={clientA} />
            : <PatientPicker client={clientA} />
          }
      </div>
      {
        patientIdA ?
          <div className='app-wrapper-col'>
            <PatientProvider>
              <AppBWrapper clientB={clientB} />
            </PatientProvider>
          </div>
        : null
      }
    </div>
  );
};


function AppBWrapper(props) {
  const { clientB } = props;
  const patientContextB = usePatientContext();
  const patientIdB = patientContextB.patientId;

  return (
    patientIdB ?
      <App client={clientB}/>
    : <PatientPicker client={clientB} />
  );
};