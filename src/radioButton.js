import React, { Component } from "react";

class RadioButton extends Component {
  render() {
    const inputId = `${this.props.label}-input`;
    return (
      <label
        htmlFor={inputId}
        className={
          this.props.selected === this.props.label.toLowerCase()
            ? "selected-radio"
            : ""
        }
      >
        {this.props.label}
        <input
          type="radio"
          id={inputId}
          name="sort-type"
          value={inputId}
          checked={this.props.selected === this.props.label.toLowerCase()}
          onChange={event => this.props.onChange(this.props.label)}
        />
      </label>
    );
  }
}

export default RadioButton;
