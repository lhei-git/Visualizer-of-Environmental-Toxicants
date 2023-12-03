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
  
  /* A bunch of random colors I found on some color generator */
  const timelineColors = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
  ];
  
  // Cut off labels and add parentheses
  const maxLabelLength = 20;
  
  // Amrita - Added from App.js file
  /* handler for updating state */
  const reducer = (state, action) => {
    switch (action.type) {
      case "setMap":
        /* Store latest searched location in session */
        sessionStorage.setItem("map", JSON.stringify(action.payload));
        return {
          ...state,
          map: action.payload,
        };
      case "setFilters":
        const newFilters = Object.assign({}, action.payload);
        return { ...state, filters: newFilters };
  
      case "setErrorMessage":
        return { ...state, errorMessage: action.payload };
      default:
        throw new Error();
    }
  };
  
  /* individual state setters */
  const setMap = (payload) => ({ type: "setMap", payload });
  const setFilters = (payload) => ({ type: "setFilters", payload });
  const setErrorMessage = (payload) => ({ type: "setErrorMessage", payload });
  
  
  function handleError(err) {
    console.error(err);
    console.log("Error with loading content. Please try again later") // Amrita - Adding error message
  }
  
  /* compare function used for sorting timeline graphs */
  const compare = (a, b) => {
    return a.year - b.year;
  };
  
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
  
  /* Add css styling to base X-Axis React Component */
  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    let { value } = payload;
    if (value.length > maxLabelLength + 5) {
      value = value.slice(0, maxLabelLength + 5) + "...";
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text fontSize="12" transform="rotate(-35)" x={0} y={0} dx={-10}>
          <tspan textAnchor="end" x="0" dy="0">
            {value}
          </tspan>
        </text>
      </g>
    );
  };
  
  /* Add css styling to base Y-Axis React Component */
  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    let { value } = payload;
    if (value.length > maxLabelLength) {
      value = value.slice(0, maxLabelLength) + "...";
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text fontSize="12" x={0} y={0} dx={10}>
          <tspan textAnchor="start" x="0" dy="0">
            {value}
          </tspan>
        </text>
      </g>
    );
  };
  
  /* Custom X axis for top ten graphs */
  class CustomXAxis extends XAxis {
    static defaultProps = {
      ...XAxis.defaultProps,
      dataKey: "name",
      type: "category",
      interval: 0,
      tick: CustomXAxisTick,
    };
  }
  
  /* Custom X axis */
  class CustomYAxis extends YAxis {
    static defaultProps = {
      ...YAxis.defaultProps,
      type: "number",
      unit: "lbs",
      width: 100,
      tickFormatter: customYAxisTickFormatter,
    };
  }
  
  /* take parsed timeline data and create a list of Recharts components */
  const generateLines = (data) => {
    const timelineKeys = (data) => {
      const correctIndex = [...data].sort(
        (a, b) => Object.keys(b).length - Object.keys(a).length
      )[0];
      return Object.keys(correctIndex);
    };
  
    if (data.length === 0) {
      return <></>;
    }
  
    const keys = timelineKeys(data);
    const lines = keys
      .filter((k) => k !== "year")
      .map((k, i) => (
        <CustomLine key={k} dataKey={k} stroke={timelineColors[i]}></CustomLine>
      ));
    return lines;
  };
  


const timelineAspectRatio = 17 / 9;


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

function TRITimeline({ map, filters, onFilterChange }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
  const [currentTab, setCurrentTab] = React.useState(
  );

  /* Setter for current tab */
  function chooseTab(i) {
    sessionStorage.setItem("currentTab", i);
    setCurrentTab(i);
  }

  return (
    <div className="comp-graph-container">
      <div className="tri-filter-container">
        <p>Choose a specific chemical:</p>
          <TRIFilters
            map={map}
            filters={filters}
            onFilterChange={onFilterChange}
          ></TRIFilters>
      </div>
        
        <div className="comp-timeline-total">
            <TimelineTotal map={map} filters={filters} />
        </div>
    </div>
  );
}

TRITimeline.propTypes = {
    filters: PropTypes.shape({
        chemical: PropTypes.string.isRequired,
        pbt: PropTypes.bool.isRequired,
        carcinogen: PropTypes.bool.isRequired,
        releaseType: PropTypes.oneOf([
          "all",
          "air",
          "water",
          "land",
          "on_site",
          "off_site",
        ]).isRequired,
        year: PropTypes.number.isRequired,
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