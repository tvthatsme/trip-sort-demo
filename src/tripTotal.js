import React, { Component } from "react";

class TripTotal extends Component {
  render() {
    return (
      <div className="result-route">
        <p className="result-route__total">{this.props.title}</p>
        <p className="result-route__total-time">{this.props.length}</p>
        <p className="result-route__total-cost">{this.props.cost}€</p>
      </div>
    );
  }
}

export default TripTotal;
