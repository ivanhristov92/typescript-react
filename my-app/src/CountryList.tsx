import * as React from "react";
import {
  CountriesService,
  Country
} from "./services/countries/countries-service";
import * as _ from "ramda";
import { SyntheticEvent } from "react";
import "./CountryList.css";

import ArrowDownIcon from "./images/ArrowDown";
import ArrowUpIcon from "./images/ArrowUp";
import ArrowRightIcon from "./images/ArrowRight";
import ArrowLeftIcon from "./images/ArrowLeft";
import ArrowDoubleRightIcon from "./images/ArrowDoubleRight";
import ArrowDoubleLeftIcon from "./images/ArrowDoubleLeft";

type Props = {
  countriesService: CountriesService;
  history: {
    push: Function;
  };
};

type State = {
  countries: Country[];
  page: number;
  itemsPerPage: number;
  sortBy: { accessor: string; order: string };
};

export default class CountryList extends React.Component<Props, State> {
  state = {
    countries: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: { accessor: "", order: "asc" }
  };

  componentDidMount(): void {
    this.props.countriesService.read().then(this.handleCountriesChange);
  }

  /**
   * Updates countries in state
   * @param countries
   */
  handleCountriesChange = (countries: Country[]) => {
    this.setState({
      countries
    });
  };

  /**
   * Updates page number in state
   * @param pageNumber
   */
  handlePageChange = (pageNumber: number) => {
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    this.setState({
      page: pageNumber
    });
  };

  /**
   * Selects the countries for the current page
   */
  pickCountries = (() => {
    /**
     * pickCountries
     */
    return () => {
      let { countries, itemsPerPage } = this.state;
      let offsetPosition = calculateOffset(this.state);
      let endPosition = offsetPosition + itemsPerPage;
      return pickFromTo<Country>(offsetPosition, endPosition, countries);
    };

    /**
     * helper
     */
    function calculateOffset(state: State): number {
      let { page, itemsPerPage } = state;
      return page === 1 ? 0 : page * itemsPerPage - 1;
    }
  })();

  /**
   * Sort by accessor (per column sorting)
   * @param accessor
   */
  sort = (accessor: string) => {
    let countries: Country[] = _.sortBy(_.prop(accessor), this.state.countries);
    let sortBy;

    if (this.state.sortBy.accessor !== accessor) {
      sortBy = { accessor, order: "asc" };
    } else {
      let newSortOrder = this.state.sortBy.order === "asc" ? "desc" : "asc";
      newSortOrder === "desc" && countries.reverse();
      sortBy = { accessor, order: newSortOrder };
    }

    this.setState({
      countries,
      sortBy
    });
  };

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">List Of Countries</h1>
          <p>
            This app lists all countries and you can navigate to any of them by
            pressing its name for three seconds.
          </p>
        </header>
        <Table
          data={this.pickCountries()}
          columns={[
            {
              title: "Name",
              accessor: "name",
              options: {
                sort: true,
                longClick: {
                  time: 3000,
                  cb: (item: Country) => {
                    this.props.history.push("/countries/" + item.name);
                  }
                }
              }
            },
            { title: "Capital", accessor: "capital", options: { sort: true } }
          ]}
          sort={this.sort}
          order={this.state.sortBy.order}
          accessor={this.state.sortBy.accessor}
        />
        <div>
          <Pager
            numberOfItems={this.state.countries.length}
            itemsPerPage={this.state.itemsPerPage}
            currentPage={this.state.page}
            toPage={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

type PagerProps = {
  numberOfItems: number;
  itemsPerPage: number;
  toPage: (page: number) => void;
  currentPage: number;
};

class Pager extends React.Component<PagerProps> {
  render() {
    let pLength = Math.ceil(this.props.numberOfItems / this.props.itemsPerPage);

    const spanStyle = {
      display: "inline-block",
      padding: 4,
      cursor: "pointer"
    };

    return (
      <div style={{ textAlign: "center", padding: 5 }}>
        <span
          data-testid="double-left"
          style={spanStyle}
          onClick={() => this.props.toPage(1)}
        >
          <ArrowDoubleLeftIcon style={{ height: 10, width: 10 }} />
        </span>
        <span
          style={spanStyle}
          data-testid="single-left"
          onClick={() => this.props.toPage(this.props.currentPage - 1)}
        >
          <ArrowLeftIcon style={{ height: 10, width: 10 }} />
        </span>
        <input
          type={""}
          value={this.props.currentPage}
          onChange={e => {
            this.props.toPage(Number(e.target.value));
          }}
          style={{
            width: 35,
            textAlign: "center"
          }}
        />
        <span
          style={spanStyle}
          data-testid="single-right"
          onClick={() => this.props.toPage(this.props.currentPage + 1)}
        >
          <ArrowRightIcon style={{ height: 10, width: 10 }} />
        </span>
        <span
          style={spanStyle}
          data-testid="double-right"
          onClick={() => this.props.toPage(pLength)}
        >
          <ArrowDoubleRightIcon style={{ height: 10, width: 10 }} />
        </span>
      </div>
    );
  }
}

function pickFromTo<T>(
  startIndex: number,
  endIndex: number,
  arr: Array<T>
): Array<T> {
  let result = [];
  for (let i = startIndex; i < endIndex; i++) {
    if (!arr[i]) {
      break;
    }
    result.push(arr[i]);
  }
  return result;
}

type TableProps = {
  data: Array<any>;
  columns: Array<{
    title: string;
    accessor: string;
    options?: {
      sort?: boolean;
      longClick?: {
        time: number;
        cb: Function;
      };
    };
  }>;
  sort: Function;
  order: string;
  accessor: string;
};

type TableState = {
  data: any[];
};

class Table extends React.Component<TableProps, TableState> {
  render() {
    return (
      <table style={{ margin: "0 auto" }} className={"country-list-table"}>
        <thead>
          <tr>
            {this.props.columns.map(
              ({ title, accessor, options = { sort: false } }) => {
                return (
                  <th
                    key={title}
                    onClick={() => this.props.sort(accessor)}
                    style={{ position: "relative" }}
                  >
                    {title}
                    {options.sort
                      ? this.props.accessor === accessor &&
                        (this.props.order === "asc" ? (
                          <ArrowDownIcon
                            style={{
                              height: 12,
                              width: 20,
                              position: "absolute",
                              top: "50%",
                              transform: "translateY(-50%)"
                            }}
                          />
                        ) : (
                          <ArrowUpIcon
                            style={{
                              height: 12,
                              width: 20,
                              position: "absolute",
                              top: "50%",
                              transform: "translateY(-50%)"
                            }}
                          />
                        ))
                      : ""}
                  </th>
                );
              }
            )}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((item, index) => {
            return (
              <tr
                key={item[this.props.columns[0].accessor]}
                data-testid={"item-row-" + item[this.props.columns[0].accessor]}
              >
                {this.props.columns.map(({ accessor, options = {} }, i) => {
                  let longClickProp = !options.longClick
                    ? {}
                    : {
                        longClick: () => {
                          if (options) {
                            // @ts-ignore
                            options.longClick.cb(item);
                          }
                        }
                      };
                  return (
                    <TableCell
                      key={accessor + i}
                      text={item[accessor]}
                      {...longClickProp}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

type CellProps = {
  text: string;
  longClick?: Function;
};
type CellState = {
  pressingSince: null | number;
};

class TableCell extends React.Component<CellProps, CellState> {
  state = {
    pressingSince: null
  };

  startPressing = (e: SyntheticEvent, level: number = 1) => {
    if (!this.props.longClick) {
      return;
    }
    if (level > 1 && !this.state.pressingSince) {
    } else {
      let perc = this.calculatePerc();
      if (perc >= 100) {
        if (this.props.longClick) {
          return this.props.longClick();
        }
      }

      if (!this.state.pressingSince) {
        this.setState({ pressingSince: Date.now() }, () =>
          setTimeout(() => {
            this.startPressing(e, level + 1);
          }, 0)
        );
      } else {
        setTimeout(() => {
          this.forceUpdate(() => this.startPressing(e, level + 1));
        }, 0);
      }
    }
  };

  stopPressing = () => {
    this.setState({
      pressingSince: null
    });
  };

  calculatePerc = () => {
    if (!this.state.pressingSince) return 0;
    let time = Date.now() - Number(this.state.pressingSince);
    let perc = (time / 3000) * 100;
    return parseFloat(perc.toFixed(2));
  };

  render() {
    return (
      <>
        <td style={{ position: "relative" }}>
          <div
            style={{
              background: "lightblue",
              height: 3,
              width: this.calculatePerc() + "%",
              position: "absolute",
              left: 0,
              bottom: 0
            }}
          />

          <TCell
            isPressing={this.state.pressingSince !== null}
            text={this.props.text}
            onMouseDown={this.startPressing}
            onMouseUp={this.stopPressing}
          />
        </td>
      </>
    );
  }
}

type TCellProps = {
  text: string;
  isPressing: boolean;
  onMouseDown(e: SyntheticEvent): void;
  onMouseUp(e: SyntheticEvent): void;
};

class TCell extends React.Component<TCellProps> {
  shouldComponentUpdate(
    nextProps: Readonly<TCellProps>,
    nextState: Readonly<{}>,
    nextContext: any
  ): boolean {
    if (!nextProps.isPressing) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div
        style={{
          lineHeight: "20px",
          zIndex: 1000,
          position: "relative"
        }}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseLeave={this.props.onMouseUp}
      >
        {this.props.text}
      </div>
    );
  }
}

//
// type AutoCompleteProps = {
//   search;
// };
//
// class AutoComplete extends React.Component<AutoCompleteProps> {
//   render() {
//     return <div />;
//   }
// }
