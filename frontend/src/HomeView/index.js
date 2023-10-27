import "./index.css";
import PlacesAutocomplete from "react-places-autocomplete";
import PropTypes from "prop-types";
const geocoder = require("../api/geocoder");
const React = require("react");
const vetapi = require("../api/vetapi");

function Home(props) {
  let [location, setLocation] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");

  /* Used to handle Elastic Beanstalk cold start */
  React.useEffect(() => {
    vetapi.get("_health").catch((err) => {
      console.log(err);
    });
  }, []);

  /* Turn generic location string into a Google Maps Object with information about the location. Collect viewport and type of location */
  async function geocodeLocation(location) {
    try {
      const res = await geocoder.get(`/json?address=${location}`);

      const results = res.data.results[0];
      const city = results.address_components.find((c) =>
        /* city */
        c.types.includes("locality")
      );
      const county = results.address_components.find((c) =>
        /* county */
        c.types.includes("administrative_area_level_2")
      );
      const state = results.address_components.find((c) =>
        /* state */
        c.types.includes("administrative_area_level_1")
      );

      const map = {
        city: city ? city.short_name : null,
        /* keeping 'County' in the county name causes problems */
        county: county ? county.short_name.replace("County", "").trim() : null,
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

  /* store searched location */
  function handleChange(location) {
    if (errorMessage.length > 0) setErrorMessage("");
    setLocation(location);
  }

  /* start geocoding process when location is selected or user hits enter (topmost location used) */
  function handleSelect(location, placeId, suggestion) {
    /* Amrita - Error to prevent website from crashing if user types in United States */
    if (location === "United States"){
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

  /* x on right side of search bar */
  function handleCloseClick() {
    setLocation("");
  }

  /* handle problems on google's side */
  function handleError(status, clearSuggestions) {
    console.log("Error from Google Maps API", status); // eslint-disable-line no-console
    if (status === "ZERO_RESULTS") setErrorMessage(" No results found");
    clearSuggestions();
  }


  /*This function presents home view information as well as a button to search specific filters*/
  return (
    <div className="home-container">
      <div className="background">
        <div className="overlay"></div>
      </div>
      <div className="content-group">
        <div className="header">Visualizer of Environmental Toxicants and Health Outcomes</div>
        <div className="caption">
          Please select a location to see U.S. facilities emitting toxic chemicals into
          the air, land and water; statistics and trends on releases of
          toxicants into the environment; as well as detailed information on
          potential health hazards from these toxic chemicals. You will also be able to 
          view information on public health measures concerning the people in the specified 
          location.
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
                        x
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
            <div className="error-message"><span className="error-icon">&#9888;</span>
            {errorMessage}</div>
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
