import * as React from "react";
import "./Autocomplete.css";
import ClickAway from "./ClickAway";

type Item = any;

type Props = {
  changeStrategy: (inputValue: string) => Promise<Item[]>;
  onSelectionChanged?: (item: Item) => any;
  itemLabelProperty: string;
};

type State = {
  items: Item[];
  inputValue: string;
  open: boolean;
  selectedSuggestion: number;
};

export default class AutoComplete extends React.Component<Props, State> {
  state = {
    items: [],
    inputValue: "",
    open: false,
    selectedSuggestion: 0
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.inputValue !== this.state.inputValue) {
      this.runUpdateStrategy();
    }
  }

  runUpdateStrategy = () => {
    this.props.changeStrategy(this.state.inputValue).then((items: Item[]) => {
      this.setState({
        items
      });
    });
  };

  // @ts-ignore
  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value,
      open: true,
      selectedSuggestion: 0
    });
  };

  // @ts-ignore
  handleKeyPressed = e => {
    let handlers = {
      13: this.handleEnterPressed,
      38: this.handleUpArrowPressed,
      40: this.handleDownArrowPressed
    };
    if (handlers[e.keyCode]) {
      handlers[e.keyCode]();
    }
  };

  handleEnterPressed = () => {
    this.setInputValueToSelectedItem().then(this.callOnSelectionChangeHandler);
  };

  setInputValueToSelectedItem = () => {
    const { selectedSuggestion, items } = this.state;
    const { itemLabelProperty } = this.props;
    return new Promise(resolve => {
      this.setState(
        {
          inputValue: items[selectedSuggestion][itemLabelProperty],
          open: false
        },
        resolve
      );
    });
  };

  callOnSelectionChangeHandler = () => {
    if (this.props.onSelectionChanged) {
      let selectedItem = this.state.items.find(i => {
        return i[this.props.itemLabelProperty] === this.state.inputValue;
      });
      this.props.onSelectionChanged(selectedItem);
    }
  };

  handleUpArrowPressed = () => {
    if (this.state.selectedSuggestion > 0) {
      this.setState({
        selectedSuggestion: this.state.selectedSuggestion - 1
      });
    }
  };

  handleDownArrowPressed = () => {
    if (this.state.selectedSuggestion < 9) {
      this.setState({
        selectedSuggestion: this.state.selectedSuggestion + 1
      });
    }
  };

  closeSuggestions = () => {
    this.setState({
      open: false
    });
  };

  handleSuggestionClicked = (item: Item) => {
    this.setState({
      inputValue: item[this.props.itemLabelProperty],
      open: false
    });
  };

  render() {
    return (
      <>
        <ClickAway
          onClickAway={() => {
            debugger;
            this.closeSuggestions();
          }}
        >
          <input
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyPressed}
            value={this.state.inputValue}
            ref={"input"}
            onDoubleClick={() => {
              this.setState({
                open: true,
                selectedSuggestion: 0
              });
            }}
          />
          {this.state.open && (
            <ul className={"auto-complete-suggestions-list"}>
              {this.state.items.map((item: Item, index: number) => {
                return (
                  <li
                    className={`auto-complete-suggestion ${
                      this.state.selectedSuggestion === index ? "active" : ""
                    }`}
                    onClick={() => this.handleSuggestionClicked(item)}
                    onMouseMoveCapture={() => {
                      this.setState({
                        selectedSuggestion: index
                      });
                    }}
                  >
                    {item[this.props.itemLabelProperty]}
                  </li>
                );
              })}
            </ul>
          )}
        </ClickAway>
      </>
    );
  }
}
