// Amrita - Taking only the Total Releases Timeline portion of Graphview index.js

import "./index.css";
import React, { useEffect, useState } from "react";
import TRIFilters from "./TRIfilters";
import PropTypes from "prop-types";

const vetapi = require("../api/vetapi");
const { amountAsLabel, formatAmount } = require("../helpers");
const { years } = require("../contants");

const initialState = {
  location: "",
  showPubchemInfo: false,
  chemicals: [],
  currentChemical: "",
};

const {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    ResponsiveContainer,
  } = require("recharts");

  
  // Amrita - Added from App.js file

  function handleError(err) {
    console.error(err);
    console.log("Error with loading content. Please try again later") // Amrita - Adding error message
  }
  
  
  /* convert properties of graph to query params for the VET api */
  const createParams = ({ map, filters }, customParams) => {
    const params = {
      city: map.city,
      county: map.county,
      state: map.state,
      carcinogen: filters.carcinogen,
      pbt: filters.pbt,
      release_type: filters.releaseType,
      chemical: filters.chemical,
      year: filters.year,
    };
    Object.assign(params, customParams);
    return { params };
  };
  
  const customYAxisTickFormatter = (val) => amountAsLabel(val) + " ";
  
  /* Custom tooltip */
  class CustomTooltip extends Tooltip {
    static defaultProps = {
      ...Tooltip.defaultProps,
      contentStyle: {
        color: "#FFF",
        background: "rgba(0,0,0,0.8)",
        border: "none",
      },
      itemStyle: { color: "#FFF" },
      labelStyle: { fontSize: "24px", fontWeight: "bold" },
      isAnimationActive: false,
      formatter: (value) => formatAmount(value),
      itemSorter: (a) => -a.value,
    };
  }
  
  /* custom line */
  class CustomLine extends Line {
    static defaultProps = {
      ...Line.defaultProps,
      type: "monotone",
      strokeWidth: 3,
      dot: false,
      activeDot: { r: 8 },
    };
  }
  
  /* Custom Y axis */
  class CustomYAxis extends YAxis {
    static defaultProps = {
      ...YAxis.defaultProps,
      type: "number",
      unit: "lbs",
      width: 100,
      tickFormatter: customYAxisTickFormatter,
    };
  }
  


const timelineAspectRatio = 17 / 9;

/* Amrita - Adding useEffect and fetchData to previous TimelineTotal function */
const TimelineTotal = ({ map, filters }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!map) return;
      try {
        const res = await vetapi.get(
          "/stats/location/timeline/total",
          createParams({ map, filters }, { year: null })
        );
        const timelineData = res.data;

        for (let i = years.start; i <= years.end; i++) {
          if (!timelineData.find((d) => d.year === i)) {
            timelineData.push({
              year: i,
              total: 0,
            });
          }
        }

        timelineData.sort((a, b) => a.year - b.year);
        setData(timelineData);
      } catch (err) {
        handleError(err);
        setData(null);
      }
    }

    fetchData();

    return () => (mounted = false);
  }, [map, filters]);

  if (!data) {
    return null;
  }

  return (
    <div>
      {/* Returns formatted timeline (tooltip, y-axis, etc.) */}
        <ResponsiveContainer width="100%" aspect={timelineAspectRatio}>
          <LineChart data={data} margin={{ right: 150 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" />
            <CustomYAxis></CustomYAxis>
            <CustomTooltip></CustomTooltip>
            <CustomLine
              name="total (lbs)"
              dataKey="total"
              stroke="#9c27b0"
            ></CustomLine>
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

TimelineTotal.propTypes = {
  map: PropTypes.object,
  filters: PropTypes.object,
};

/* Amrita - Created function to show chemical drop-down and selected chemical's timeline */
function TRITimeline({ map, filters, onFilterChange }) {

  return (
    <div className="comp-graph-container">
      {/* Amrita - Asks user to choose a chemical and shows chemical drop-down list from TRIFilters */}
      <div className="tri-filter-container">
        <p>Choose a specific chemical:</p>
          <TRIFilters
            map={map}
            filters={filters}
            onFilterChange={onFilterChange}
          ></TRIFilters>
      </div>
        
        {/* Amrita - Shows timeline for selected option in drop-down */}
        <div className="comp-timeline-total">
            <TimelineTotal map={map} filters={filters} />
        </div>
    </div>
  );
}

TRITimeline.propTypes = {
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
      onFilterChange: PropTypes.func.isRequired,
};


export default TRITimeline;