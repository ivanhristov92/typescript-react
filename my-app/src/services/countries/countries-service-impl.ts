import { CountriesService } from "./countries-service";
// @ts-ignore
import sa from "superagent";

type SAResponse = {
  body: any;
};

export const countriesService: CountriesService = {
  read: (query?: string) => {
    if (query) {
      return sa
        .get(`https://restcountries.eu/rest/v2/name/${query}`)
        .then((response: SAResponse) => response.body)
        .catch((err: any) => {
          console.log(err);
          return [];
        });
    }

    return sa
      .get("https://restcountries.eu/rest/v2/all")
      .then((response: SAResponse) => response.body)
      .catch((err: any) => {
        console.log(err);
        return [];
      });
  },
  readOne: (name: string) => {
    return sa
      .get(`https://restcountries.eu/rest/v2/name/${name}`)
      .then((response: SAResponse) => response.body[0])
      .catch((err: any) => {
        console.log(err);
        return [];
      });
  }
};
