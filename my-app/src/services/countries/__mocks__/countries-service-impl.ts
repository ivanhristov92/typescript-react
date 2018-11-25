import { CountriesService } from "../countries-service";

export function makeCountriesService(mockedResponses?: {
  read: any[];
  readOne: Object;
}): CountriesService {
  return {
    read: jest.fn(
      () =>
        new Promise(resolve => {
          if (mockedResponses) {
            return resolve(mockedResponses.read || [{ name: "Some Country" }]);
          }
          resolve([{ name: "Some Country" }]);
        })
    ),
    readOne: jest.fn(
      () =>
        new Promise(resolve => {
          if (mockedResponses) {
            return resolve(mockedResponses.readOne || { name: "Some Country" });
          }
          resolve({ name: "Some Country" });
        })
    )
  };
}
