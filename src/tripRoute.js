import React, { Component } from "react";

class TripRoute extends Component {
  render() {
    return (
      <div>
        {this.props.trip.map((deal, index) => {
          return (
            <div key={index} className="result-route">
              <p className="result-route__title">
                {deal.departure} to {deal.arrival}
              </p>
              <p className="result-route__description">
                {deal.transport} {deal.reference} for {deal.duration.h}h{
                  deal.duration.m
                }
              </p>
              <p className="result-route__price">{deal.cost}€</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default TripRoute;
