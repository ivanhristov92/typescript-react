import * as React from "react";

type Props = {
  onClickAway: Function;
};

export default class ClickAway extends React.Component<Props> {
  private wrapperRef: any;
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  // @ts-ignore

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  /**
   * Alert if clicked on outside of element
   */
  // @ts-ignore

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onClickAway();
    }
  };

  render() {
    return <div ref={this.setWrapperRef}>{this.props.children}</div>;
  }
}
