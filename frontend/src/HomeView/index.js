import "./index.css";
import PlacesAutocomplete from "react-places-autocomplete";
import PropTypes from "prop-types";

import { useState, useEffect } from "react";
const geocoder = require("../api/geocoder");
const React = require("react");
const vetapi = require("../api/vetapi");



function Home(props) {
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    vetapi.get("_health").catch((err) => {
      console.log(err);
    });
  }, []);

  async function geocodeLocation(location) {
    try {
      const res = await geocoder.get(`/json?address=${location}`);

      const results = res.data.results[0];
      const city = results.address_components.find((c) =>
        c.types.includes("locality")
      );
      const county = results.address_components.find((c) =>
        c.types.includes("administrative_area_level_2")
      );
      const state = results.address_components.find((c) =>
        c.types.includes("administrative_area_level_1")
      );

      const map = {
        city: city ? city.short_name : null,
        county: county
          ? county.short_name.replace("County", "").trim()
          : null,
        state: state ? state.short_name : null,
        stateLong: state ? state.long_name : null,
        center: results.geometry.location,
        viewport: results.geometry.viewport,
      };
      return map;
    } catch (err) {
      throw new Error(err);
    }
  }

  function handleChange(location) {
    if (errorMessage.length > 0) setErrorMessage("");
    setLocation(location);
  }

  function handleSelect(location, placeId, suggestion) {
    /* Amrita - Error to prevent website from crashing if user searches for US as a whole */
    if (location === "United States" || location === "USA" || location === "United States of America"){
      setErrorMessage(" Please select a specific city, county, or state.")
    }
    else {
    geocodeLocation(suggestion ? suggestion.description : location)
      .then((map) => {
        props.onSuccess(map);
      })
      .catch((error) => console.error("Error", error));
    }
  }

  function handleCloseClick() {
    setLocation("");
  }

  function handleError(status, clearSuggestions) {
    console.log("Error from Google Maps API", status);
    if (status === "ZERO_RESULTS") setErrorMessage(" No results found");
    clearSuggestions();
  }

  return (
    <div className="home-container">
      <div className="background">
        <div className="overlay"></div>
      </div>
      <div className="content-group">
        <div className="header">
          Visualizer of Environmental Health Risks
        </div>
        <div className="caption">
          Type a U.S. city, county or state to visualize: facilities releasing toxic chemicals into the environment, 
          specific chemical information associated with the releases, and measures of various public health issues in 
          the searched location.
        </div>

        <div className="search-bar">
          <PlacesAutocomplete
            onChange={handleChange}
            value={location}
            onSelect={handleSelect}
            onError={handleError}
            shouldFetchSuggestions={location.length > 2}
            highlightFirstSuggestion={true}
            searchOptions={{
              types: ["geocode"],
              componentRestrictions: {
                country: "us",
              },
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => {
              return (
                <div className="search-bar-container">
                  <div className="search-input-container">
                    <input
                      {...getInputProps({
                        placeholder: "Type location name and select to search",
                        className: "search-input",
                      })}
                    />
                    {location.length > 0 && (
                      <button
                        className="clear-button"
                        onClick={handleCloseClick}
                      >
                      {/* Amrita- Changed the clearing search button from the letter x to a symbol for a neater look */}
                        <div className="clear-message">
                          <span className="clear-icon">&#10005;</span>
                        </div>
                      </button>
                    )}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="autocomplete-container">
                      {suggestions.map((suggestion, i) => {
                        const className = `suggestion-item ${
                          suggestion.active ? "active" : ""
                        }`;

                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                            })}
                          >
                            <strong>
                              {suggestion.formattedSuggestion.mainText}
                            </strong>{" "}
                            <small>
                              {suggestion.formattedSuggestion.secondaryText}
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }}
          </PlacesAutocomplete>
          {errorMessage.length > 0 && (
            /* Amrita - Need span part to read the error icon */
            <div className="error-message">
              <span className="error-icon">&#9888;</span>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default Home;
