import React, { Component } from "react";
import "./App.css";
import data from "./response.json";
import SelectCity from "./selectCity.js";
import RadioButton from "./radioButton.js";
import TripRoute from "./tripRoute.js";
import TripTotal from "./tripTotal.js";

class App extends Component {
  /**
   * App constructor
   */
  constructor() {
    super();

    this.state = {
      departureCities: [],
      arrivalCities: [],
      allDepartureCities: [],
      allArrivalCities: [],
      departure: "",
      arrival: "",
      sortBy: "cheapest",
      searchResult: [],
      showError: false
    };

    this.routes = [];
  }

  /*
   * Get all unique departures
   */
  getAllDepartures(deals) {
    const allCities = deals.map(deal => deal.departure).sort();
    return [...new Set(allCities)];
  }

  /**
   * Get all unique arrivals
   */
  getAllArrivals(deals) {
    const allCities = deals.map(deal => deal.arrival).sort();
    return [...new Set(allCities)];
  }

  /**
   * React lifecyle component did mount method
   */
  componentDidMount() {
    this.setState({
      departureCities: this.getAllDepartures(data.deals),
      allDepartureCities: this.getAllDepartures(data.deals),
      arrivalCities: this.getAllArrivals(data.deals),
      allArrivalCities: this.getAllArrivals(data.deals)
    });
  }

  /**
   * Set the departure city for the form
   */
  setDeparture = e => {
    const departure = e.target.value;
    const arrivalsNotDeparture = this.state.allDepartureCities
      .filter(city => city !== departure)
      .sort();
    this.setState({
      departure: departure,
      arrivalCities: arrivalsNotDeparture
    });
  };

  /**
   * Set the arrival city for the form
   */
  setArrival = e => {
    const arrival = e.target.value;
    const departuresNotArrival = this.state.allArrivalCities
      .filter(city => city !== arrival)
      .sort();
    this.setState({
      arrival: arrival,
      departureCities: departuresNotArrival
    });
  };

  /**
   * Set the sort type for the form
   */
  setSort = sortType => {
    this.setState({
      sortBy: sortType.toLowerCase()
    });
  };

  /**
   * Build a listing of all the possible routes
   */
  compileAllResults = (route, trip) => {
    let routeCopy = JSON.parse(JSON.stringify(route));

    // protect ourselves from a trip that wanders all over Europe
    if (routeCopy.length > 5) {
      return null;
    }

    if (trip.arrival === this.state.arrival) {
      // we've reached the destination, return the complete route
      routeCopy.push(trip);
      // push this route to the global routes array so we can use it later
      // in a flatter format
      this.routes.push(routeCopy);
      return routeCopy;
    } else {
      // we will keep looking through this route
      routeCopy.push(trip);

      // get a list of all past departures
      const routeDepartures = routeCopy.map(tripTaken => tripTaken.departure);

      // create array of cities from this location
      const citiesToTry = data.deals
        .filter(deal => deal.departure === trip.arrival)
        .filter(deal => !routeDepartures.includes(deal.arrival));

      // Dive deeper into the routes to find our desired arrival city
      const results = citiesToTry.map(deal =>
        this.compileAllResults(routeCopy, deal)
      );

      // Return any routes that are useful
      return results.filter(result => result !== null && result.length);
    }
  };

  /**
   * Get the cost of the trip from an array of deals
   */
  getTripCost = tripArray => {
    return tripArray.reduce((total, tripLeg) => total + tripLeg.cost, 0);
  };

  /**
   * Get the length of the trip in minutes from an array of deals
   */
  getTripLength = tripArray => {
    return tripArray.reduce((total, tripLeg) => {
      return (
        total +
        parseInt(tripLeg.duration.h, 10) * 60 +
        parseInt(tripLeg.duration.m, 10)
      );
    }, 0);
  };

  /**
   * Convert a number of minutes into a formatted hour minute string
   */
  convertMinsToReadable = minutes => {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (mins < 10) {
      mins = `0${mins}`;
    }
    return `${hours}h${mins}`;
  };

  /**
   * Perform a search
   */
  searchTrips = e => {
    e.preventDefault();

    // Determine any error states
    if (this.state.arrival === "" || this.state.departure === "") {
      this.setState({
        showError: true
      });
      return;
    } else {
      this.setState({
        showError: false
      });
    }

    const firstTrip = data.deals.filter(
      trip => trip.departure === this.state.departure
    );

    firstTrip.map(deal => this.compileAllResults([], deal));

    let bestMatch = [];
    if (this.state.sortBy === "cheapest") {
      bestMatch = this.routes.reduce((cheapsetTrip, routeCombination) => {
        const routePrice = this.getTripCost(routeCombination);
        const currentCheapest = this.getTripCost(cheapsetTrip);

        return routePrice < currentCheapest ? routeCombination : cheapsetTrip;
      }, this.routes[0]);
    } else {
      bestMatch = this.routes.reduce((fastestTrip, routeCombination) => {
        const routeTime = this.getTripLength(routeCombination);
        const fastestTime = this.getTripCost(fastestTrip);

        return routeTime < fastestTime ? routeCombination : fastestTrip;
      }, this.routes[0]);
    }

    this.setState({
      searchResult: bestMatch
    });
  };

  /**
   * Clear the results of the search
   */
  clearResults = e => {
    this.routes = [];
    this.setState({
      searchResult: [],
      departure: "",
      arrival: "",
      sortBy: "cheapest"
    });
  };

  /**
   * Render the application
   */
  render() {
    return (
      <div className="sorter-container">
        <h1>Trip Sorter</h1>
        <form
          style={
            this.state.searchResult.length === 0 ? {} : { display: "none" }
          }
        >
          <SelectCity
            id="departure-select"
            label="From:"
            cities={this.state.departureCities}
            valueSelected={this.state.departure}
            onChange={event => this.setDeparture(event)}
          />
          <SelectCity
            id="arrival-select"
            label="To:"
            cities={this.state.arrivalCities}
            valueSelected={this.state.arrival}
            onChange={event => this.setArrival(event)}
          />

          <p className="form-label">Sort by:</p>
          <div className="radio-group">
            <RadioButton
              label="Cheapest"
              selected={this.state.sortBy}
              onChange={type => this.setSort(type)}
            />
            <RadioButton
              label="Fastest"
              selected={this.state.sortBy}
              onChange={type => this.setSort(type)}
            />
          </div>
          <p style={this.state.showError ? {} : { display: "none" }}>
            Please fill in all the fields
          </p>
          <input
            type="submit"
            value="Search"
            className="action-btn"
            onClick={this.searchTrips}
          />
        </form>

        <div style={this.state.searchResult.length ? {} : { display: "none" }}>
          <p className="result-description">
            Showing {this.state.sortBy} trip from {this.state.departure} to{" "}
            {this.state.arrival}
          </p>
          <TripRoute trip={this.state.searchResult} />
          <TripTotal
            title="Total"
            length={this.convertMinsToReadable(
              this.getTripLength(this.state.searchResult)
            )}
            cost={this.getTripCost(this.state.searchResult)}
          />
          <button className="action-btn" onClick={this.clearResults}>
            Reset
          </button>
        </div>
      </div>
    );
  }
}

export default App;
