import React from 'react';
import './AppWrapper.css';
import { useLoaderData } from 'react-router-dom';
import App from './App';

export default function AppWrapper() {
  const { clientA, clientB } = useLoaderData();

  return (
    <div className="app-wrapper">
      <div className='app-wrapper-col'>
        <App client={clientA} id={"A"} />
      </div>
      <div className='app-wrapper-col'>
        <App client={clientB} id={"B"}/>
      </div>
    </div>
  );
};
