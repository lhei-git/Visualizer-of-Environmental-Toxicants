// Amrita - Taking only the All Chemicals portion of Filters index.js

import "./index.css";
import vetapi from "../api/vetapi";
import PropTypes from "prop-types";
const React = require("react");
const { formatChemical, getLocationString } = require("../helpers");

//search button and text box
function TRIFilters(props) {
  const [chemicals, setChemicals] = React.useState([]);

  /* Update chemical list with chemicals found in the selected window under the current search parameters */
  React.useEffect(() => {
    async function fetchChemicalList(map) {
      const params = {
        city: map.city,
        county: map.county,
        state: map.state,
        year: props.filters.year,
        release_type: props.filters.releaseType,
        pbt: props.filters.pbt,
        carcinogen: props.filters.carcinogen || null,
      };
      try {
        const res = await vetapi.get("/chemicals", { params });
        const tmp = [...new Set(res.data.map((d) => formatChemical(d)).sort())];
        setChemicals(tmp);
      } catch (err) {
        console.log(err);
      }
    }

    if (props.map) fetchChemicalList(props.map);
  }, [props.filters, props.map]);

  /* Update app-level filters when component-level filters change. Propagates change to other filters */
  function onFilterChange(event) {
    const target = event.target;
    const filters = Object.assign({}, props.filters);
    const value = target.type === "checkbox" ? target.checked : target.value;
    if (target.name === "year") filters[target.name] = parseInt(value);
    else filters[target.name] = value;
    if (["carcinogen", "pbt"].includes(target.name) && target.checked) {
      filters["chemical"] = "all";
    } else if (target.name === "chemical") {
      filters["carcinogen"] = false;
      filters["pbt"] = false;
    }
    props.onFilterChange(filters);
  }

  /* Create select dropdown of chemicals released */
  function getChemicals() {
    let options = [];
    options.push(
      <option defaultValue={true} key="all" value="all">
        All chemicals
      </option>
    );
    if (chemicals.length === 0) return options;

    for (var chemical of chemicals) {
      options.push(
        <option key={chemical} value={chemical}>
          {chemical}
        </option>
      );
    }
    return options;
  }

  return (
    <div style={{ display: "flex" }}>
      <div className="tricomp-control-header">
        {props.map && <h1>{getLocationString(props.map, true)}</h1>}
      </div>
      <div className="tricomp-control-container">
        <div className="tricomp-content">
          <select
            name="chemical"
            value={props.filters.chemical}
            onChange={onFilterChange}
            id=""
          >
            {getChemicals()}
          </select>
        </div>
      </div>
    </div>
  );
}
TRIFilters.propTypes = {
  filters: PropTypes.shape({
    chemical: PropTypes.string.isRequired,
  }),
  map: PropTypes.shape({
    city: PropTypes.string,
    county: PropTypes.string,
    state: PropTypes.string,
    stateLong: PropTypes.string,
    center: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
    viewport: PropTypes.shape({
      northeast: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
      southwest: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
    }),
  }),
};

export default TRIFilters;
