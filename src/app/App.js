import React, { useState } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router";
import "./App.css";

import Recording from "./recording/Recording";
import MainMenu from "./components/MainMenu";
import Welcome from "./components/Welcome";
import VerifyToken from "./components/VerifyToken";

const APP_STATE = Object.freeze({
  RECORDING: Symbol("RECORDING"),
});

function App() {
  const [appState, setAppState] = useState(APP_STATE.RECORDING);

  function renderAppState() {
    switch (appState) {
      case APP_STATE.RECORDING:
        return <Recording />;

      default:
        return "Not yet implemented";
    }
  }

  return (
    <div>
      <Router>
        <Route path="/" component={MainMenu} />
        <Route exact path="/home">
          <Redirect to="/" />
        </Route>
        <Route path="/welcome" component={Welcome} />
        <Route path="/verify-token" component={VerifyToken} />
        <Route exact path="/">
          {renderAppState()}
        </Route>
      </Router>
    </div>
  );
}

export default App;
