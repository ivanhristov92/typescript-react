import * as React from "react";
import * as _ from "ramda";
import {
  CountriesService,
  Country
} from "./services/countries/countries-service";
import AutoComplete from "./Autocomplete";

type Props = {
  countryName: string;
  countriesService: CountriesService;
};

type State = {
  country: Country | null;
};

export default class CountryDetails extends React.Component<Props, State> {
  state = {
    country: null
  };

  componentDidMount() {
    this.updateWithCountry(this.props.countryName);
  }

  updateWithCountry = (name: string) => {
    this.props.countriesService.readOne(name).then((country: Country) => {
      this.setState({
        country
      });
    });
  };

  autocompleteChangeStrategy = (inputValue: string): Promise<Country[]> => {
    return this.props.countriesService
      .read(inputValue)
      .then((countries: Country[]) => {
        return _.take(10, countries);
      });
  };

  render() {
    return (
      <div>
        <AutoComplete
          onSelectionChanged={console.log}
          changeStrategy={this.autocompleteChangeStrategy}
          itemLabelProperty={"name"}
        />

        <div style={{ margin: "0 auto", paddingTop: 50 }}>
          <div style={{ display: "flex" }}>
            <span>Flag</span>
            <span>
              <img
                height={100}
                src={(this.state.country || { flag: "" }).flag}
              />
            </span>
          </div>
          <div>
            <span>Name</span>
            <span>{(this.state.country || { name: null }).name}</span>
          </div>
          <tr>
            <th>Native Name</th>
            <td>{(this.state.country || { nativeName: null }).nativeName}</td>
          </tr>
          <tr>
            <th>Capital</th>
            <td>{(this.state.country || { capital: null }).capital}</td>
          </tr>
          <tr>
            <th>Region</th>
            <td>{(this.state.country || { region: null }).region}</td>
          </tr>
          <tr>
            <th>Subregion</th>
            <td>{(this.state.country || { subregion: null }).subregion}</td>
          </tr>
          <tr>
            <th>Population</th>
            <td>{(this.state.country || { population: null }).population}</td>
          </tr>
          <tr>
            <th>Languages</th>
            <td>
              <ul>
                {(this.state.country || { languages: [] }).languages.map(
                  (l: { name: string; nativeName: string }) => (
                    <li>
                      {l.name} / {l.nativeName}
                    </li>
                  )
                )}
              </ul>
            </td>
          </tr>
          <tr>
            <th>Time Zones</th>
            <td>
              <ul>
                {(this.state.country || { timezones: [] }).timezones.map(
                  (tz: string) => (
                    <li>{tz}</li>
                  )
                )}
              </ul>
            </td>
          </tr>
          <tr>
            <th>Currencies</th>
            <td>
              <ul>
                {(this.state.country || { currencies: [] }).currencies.map(
                  (currency: { code: string; name: string }) => (
                    <li>
                      {currency.name} / {currency.code}
                    </li>
                  )
                )}
              </ul>
            </td>
          </tr>
        </div>
      </div>
    );
  }
}
