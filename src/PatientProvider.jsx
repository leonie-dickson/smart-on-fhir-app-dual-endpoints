import React, { createContext } from "react";

const PatientContext = createContext(null)

const PatientProvider = ({ children }) => {

  const [patientId, setPatientId] = React.useState();

  return (
    <PatientContext.Provider value={{ patientId, setPatientId }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => {
  const patientContext = React.useContext(PatientContext);

  if (!patientContext) {
    throw new Error(
      "patientContext has to be used within <PatientContext.Provider>"
    );
  }

  return patientContext;
};

export default PatientProvider;
