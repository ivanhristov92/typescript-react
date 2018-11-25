import * as React from "react";
import CountryList from "./CountryList";
import CountryDetails from "./CountryDetails";
import { countriesService } from "./services/countries/countries-service-impl";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <>
          <Route
            path={"/"}
            exact
            render={props => (
              <CountryList
                countriesService={countriesService}
                history={props.history}
              />
            )}
          />
          <Route
            exact
            path={"/countries/:name"}
            render={props => (
              <CountryDetails
                countryName={props.match.params.name}
                countriesService={countriesService}
              />
            )}
          />
        </>
      </BrowserRouter>
    );
  }
}

export default App;
