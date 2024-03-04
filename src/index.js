import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthCallback from './AuthCallback';
import FHIR from 'fhirclient';
import FHIR2 from 'fhirclient2';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import AppWrapper from './AppWrapper';

const rootElement = document.getElementById('root');


const configs = [{
    clientId: 'b167e490-b1b5-4ac7-a8c2-5a54223af98d',
    iss: 'https://gw.interop.community/difference/data',
    scope: 'launch/patient openid profile'
  },{
    clientId: '3aa4b010-8923-4e45-bc47-5dfc05cf470f',
    iss: 'https://gw.interop.community/differenceb/data',
    scope: 'launch/patient openid profile'
  }
]


const smartLaunch = () => {
  // Authorize application
  return FHIR.oauth2
    .init(...configs)
    .then(clientA => {
      let nextConfig = configs.find(c => c.iss !== clientA.state.serverUrl)

      return FHIR2.oauth2
      .init({...nextConfig, redirectUri: "http://localhost:3000/authcallback"})
      .then(clientB => {
        return {clientA, clientB}
      })
      .catch(err => {
        console.error(err);
        return {clientA}
      })

    })
    .catch(err => {
      console.error(err)
      return {}
    })
};

// smartLaunch();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/" element={<AppWrapper />} loader={smartLaunch} />
      <Route path="/authcallback" element={<AuthCallback />} />
    </Route>
  )
);

ReactDOM.render(<RouterProvider router={router} />, rootElement);