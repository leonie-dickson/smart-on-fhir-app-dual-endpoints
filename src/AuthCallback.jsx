import React from 'react';
import FHIR2 from 'fhirclient2';

// Callback after successful authorization 

export default function AuthCallback() {

  FHIR2.oauth2.ready().finally((client) => {window.location.href="/";})

  return (
    <div>
      Redirecting...
    </div>
  );
};
