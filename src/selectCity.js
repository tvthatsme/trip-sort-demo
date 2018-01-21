import React, { Component } from "react";

class SelectCity extends Component {
  render() {
    return (
      <div>
        <label htmlFor={this.props.id} className="form-label">
          {this.props.label}
        </label>
        <select
          className="location-select"
          id={this.props.id}
          onChange={event => this.props.onChange(event)}
          value={this.props.valueSelected}
        >
          <option disabled value="" style={{ display: "none" }} />
          {this.props.cities.map((name, index) => {
            return <option key={index}>{name}</option>;
          })}
        </select>
      </div>
    );
  }
}

export default SelectCity;
