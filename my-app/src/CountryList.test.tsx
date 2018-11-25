import * as React from "react";
import * as _ from "ramda";
import CountryList from "./CountryList";
import { render, waitForElement, cleanup } from "react-testing-library";
import { makeCountriesService } from "./services/countries/__mocks__/countries-service-impl";

beforeEach(cleanup);
const mockedHistory = {
  push() {}
};

describe("CountryList", () => {
  test("uses CountryListService to get the items", () => {
    let countriesService = makeCountriesService();
    render(
      <CountryList
        countriesService={countriesService}
        history={mockedHistory}
      />
    );

    expect(countriesService.read).toHaveBeenCalledTimes(1);
  });

  test("lists the items", async () => {
    // @ts-ignore
    let countriesService = makeCountriesService({
      read: [{ name: "Bulgaria" }, { name: "USA" }, { name: "Ireland" }]
    });

    const { getByText } = render(
      <CountryList
        countriesService={countriesService}
        history={mockedHistory}
      />
    );

    await waitForElement(() => getByText("Bulgaria"));
    await waitForElement(() => getByText("USA"));
    await waitForElement(() => getByText("Ireland"));
  });

  test("lists the items in the initial order they are provided", async () => {
    let mockedResponse = [
      { name: "Bulgaria" },
      { name: "USA" },
      { name: "Ireland" }
    ];
    // @ts-ignore
    let countriesService = makeCountriesService({
      read: mockedResponse
    }); //

    const { getAllByTestId } = render(
      <CountryList
        countriesService={countriesService}
        history={mockedHistory}
      />
    );
    let items = await waitForElement(() => getAllByTestId(/item-row/));
    expect(items.length).toBe(3);
    items.forEach((item, index) => {
      let testId: null | string = item.getAttribute("data-testid");
      expect(testId).not.toBe(null);
      if (testId) {
        expect(testId.match(new RegExp(mockedResponse[index].name))).not.toBe(
          null
        );
      }
    });
  });

  test("paginate correctly", async () => {
    let _mockedResponse: any[] = [];
    for (let i = 1; i < 21; i++) {
      _mockedResponse.push({
        name: i + ""
      });
    }
    let mockedResponse = Object.freeze(_mockedResponse);

    // @ts-ignore
    let countriesService = makeCountriesService({
      read: mockedResponse
    });

    const { getAllByTestId, getByTestId } = render(
      <CountryList
        countriesService={countriesService}
        history={mockedHistory}
      />
    );
    let items = await waitForElement(() => getAllByTestId(/item-row/));
    expect(items.length).toBe(10);
    console.log(mockedResponse);

    items.forEach((item, index) => {
      let testId: null | string = item.getAttribute("data-testid");
      expect(testId).not.toBe(null);
      if (testId) {
        expect(testId.match(new RegExp(mockedResponse[index].name))).not.toBe(
          null
        );
      }
    });

    let singleRight = await waitForElement(() => getByTestId("single-right"));
    singleRight.click();

    let itemsAfterPageChange = await waitForElement(() =>
      getAllByTestId(/item-row/)
    );
    console.log(mockedResponse);
    expect(itemsAfterPageChange.length).toBe(10);
  });
});
