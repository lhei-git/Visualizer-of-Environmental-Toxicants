import "./index.css";
import NationalEPHCompare from "./nationalEPHCompare.js";
import React, { useState, useReducer } from 'react';
import StateEPHCompare from "./stateEPHCompare.js"
import CountyEPHCompare from "./countyEPHCompare";
import TRITimeline from "./TRItimeline";
import history from "../history";
const vetapi = require("../api/vetapi");


const {getLocationParents, getYearString} = require("../helpers");

const { years } = require("../contants");
const { amountAsLabel, formatAmount } = require("../helpers");
//created by Katherine O'Donnell

const {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} = require("recharts");



/* individual state setters */
const setFilters = (payload) => ({ type: "setFilters", payload });
const setErrorMessage = (payload) => ({ type: "setErrorMessage", payload });

const timelineAspectRatio = 17 / 9;
const customYAxisTickFormatter = (val) => amountAsLabel(val) + " ";


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

class CustomLine extends Line {
  static defaultProps = {
    ...Line.defaultProps,
    type: "monotone",
    strokeWidth: 3,
    dot: false,
    activeDot: { r: 8 },
  };
}

class CustomYAxis extends YAxis {
  static defaultProps = {
    ...YAxis.defaultProps,
    type: "number",
    unit: "lbs",
    width: 100,
    tickFormatter: customYAxisTickFormatter,
  };
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


function DataComp(props) {

  /* Amrita - Taken from App.js to define initialState, reducer, setFilters, and setErrorMessage
/* Initial state of app */
const initialState = {
  map: JSON.parse(sessionStorage.getItem("map")) || {state: null},
    filters: {
    chemical: "all",
    pbt: false,
    carcinogen: false,
    releaseType: "all",
    /*sets initial state to latest year*/
    year: 2022,
  },
  errorMessage: "",
};

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
  const [chemicals, setChemicals] = React.useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Amrita - Check if countyName is null (user searched for state) & change default measure timeline if null
  const countyName = getLocationParents(state.map, "county");

  if (countyName === null) {
    var measureState = 'Asthma in Children';  // 1st State-Level Measure
  } else {
    var measureState = 'Asthma in Adults';  // 1st County-Level Measure
  }

  const [currentMeasure, setMeasure] = useState(measureState);
  
/* Amrita - Page reverts to main page if user opens it in a new tab (instead of giving an error)*/
if (!state.map.state) {
  history.push("/");  // redirect to the search page
  return null;
}

  /* farzana
  React.useEffect(() => {
    async function fetchChemicalList(map) {
      const params = {
        city: map.city,
        county: map.county,
        state: map.state,
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
  }, [props.filters, props.map]); */

  function handleError(err) {
    console.error(err);
    console.log("Error with loading content. Please try again later") // Amrita - Adding error message
  }

  function onFilterChange(event) {
    const target = event.target;
    const filters = { ...props.filters, [target.name]: target.value };
    props.onFilterChange(filters);

    TimelineTotal({ map: props.map, filters });
  }


  /* Amrita - Timeline changes based on user's selection in drop-down */
  const handleChange = (event) => {
    setMeasure(event.target.value);
  };

  /* Amrita - Error message for TRI timeline when API isn't working */
  function toggleError() {
    dispatch(setErrorMessage("Request failed, please try again later."));
    setTimeout(() => {
      dispatch(setErrorMessage("Request failed, please try again later."));
    }, 10000);
  }

  /* farzana */
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
  async function TimelineTotal({ map, filters }) {
    try {
      const res = await vetapi.get(
        `/stats/location/timeline/total`,
        createParams({ map, filters }, { year: null })
      );
      const data = res.data;
      /* Fill total timeline with zeros, only needed if filtering by chemical and there is missing release data for one or more years */
      for (let i = years.start; i <= years.end; i++) {
        if (!data.find((d) => d.year === i)) {
          data.push({
            year: i,
            total: 0,
          });
        }
      }
      data.sort((a, b) => a.year - b.year);
      const body = (
        <div>
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
      return body;
    } catch (err) {
      handleError(err);
      return null;
    }
  }

  return (
    <div className="data-comp-container">
      <div className="content-group">

        <div className="comp-header">
          <h1>Comparison of Toxic Releases & Health Outcomes</h1>
        </div>

        <div className="data-reps">
          <div className="tri-data">
            {/* Amrita - Adding TRI page's total releases timeline to comparison page */}
            <h2>Toxicant Release</h2>
            <TRITimeline
              map={state.map}
              filters={state.filters}
              onApiError={toggleError}
              onFilterChange={(filters) => dispatch(setFilters(filters))}
            ></TRITimeline>

            {/* farzana
                        <select
                          name="chemical"
                          value={props.filters.chemical}
                          onChange={onFilterChange}
                          id=""
                        >
                          {getChemicals()}
                        </select>*/}
          </div>

          <div className="eph-data">
            {/* Amrita - Adding categorized drop-down menu for public health measures */}
            <h2>Public Health Data</h2>
            <p>Choose a public health measure:</p>

            <select onChange={handleChange} value={currentMeasure}>
            {/* Amrita - Don't show county measures in drop-down if user searched for a state */}
            {countyName !== null && (
              <optgroup label="County-Level Data">
                <option>Arsenic in Water</option>
                <option>Asthma in Adults</option>
                <option>Asthma Hospitalizations</option>
                <option>Prevalence of Cancer</option>
                <option>DEPH in Water</option>
                <option>Fertility Rate</option>
                <option>Heart Attack</option>
                <option>Infant Mortality</option>
                <option>Low Birthweight</option>
                <option>PCE in Water</option>
                <option>PFAS in Water</option>
                <option>Radium in Water</option>
                <option>TCE in Water</option>
                <option>Uranium in Water</option>
              </optgroup>
            )}

              <optgroup label="State-Level Data">
                <option>Asthma in Children</option>
                <option>Childhood Cancer Brain & Central Nervous System</option>
                <option>Childhood Cancer Leukemia</option>
                <option>Premature Birth</option>
              </optgroup>

              <optgroup label="National-Level Data">
                <option>Bisphenol and Paraben in Urine</option>
                <option>Lead in Blood</option>
                <option>Metals in Urine</option>
                <option>Pesticides in Urine</option>
                <option>PFAS in Blood</option>
                <option>Phthalates in Urine</option>
              </optgroup>
            </select>

            <div className="ephcomp-timelines">
              {/* Amrita - Calls timeline from NationalEPHCompare to display timeline for Public Health Data section */}
              {currentMeasure === "Bisphenol and Paraben in Urine" && (<NationalEPHCompare measure={"Bisphenol and Paraben in Urine"} units={"Concentration (micrograms/gram)"} measureID={859} />)}
              {currentMeasure === "Lead in Blood" && (<NationalEPHCompare measure={"Lead in Blood"} units={"Concentration (micrograms/deciliter)"} measureID={858} />)}
              {currentMeasure === "Metals in Urine" && (<NationalEPHCompare measure={"Metals in Urine"} units={"Concentration (micrograms/gram)"} measureID={856} />)}
              {currentMeasure === "Phthalates in Urine" && (<NationalEPHCompare measure={"Phthalate Metabolites in Urine (creatinine corrected)"} units={"Concentration (micrograms/gram)"} measureID={863} />)}
              {currentMeasure === "PFAS in Blood" && (<NationalEPHCompare measure={"PFAS in Blood"} units={"Concentration (micrograms/liter)"} measureID={826} />)}
              {currentMeasure === "Pesticides in Urine" && (<NationalEPHCompare measure={"Pesticides in Urine"} units={"Concentration (micrograms/gram)"} measureID={861} />)}

              {/* Amrita - Calls timeline from StateEPHCompare to display timeline for Public Health Data section */}
              {currentMeasure === "Asthma in Children" && (<StateEPHCompare measure={"Asthma among Children"} measureID={587} units={"Crude Prevalence of Children <=17 Years of Age Ever Diagnosed with Asthma (State)"} />)}
              {currentMeasure === "Childhood Cancer Brain & Central Nervous System" && (<StateEPHCompare measure={"Brain and Central Nervous System Cancer among Children"} measureID={67} 
                                                                                                         units={"Age-adjusted Incidence Rate of Brain and Other Nervous System Cancer per 100,000 Population"} />)}
              {currentMeasure === "Childhood Cancer Leukemia" && (<StateEPHCompare measure={"Leukemia among Children"} measureID={71} units={"Annual Number of Leukemia among Children <20 Years of Age"} />)}

              {/* Amrita - Calls timeline from CountyEPHCompare to display timeline for Public Health Data section */}
            {currentMeasure === "Arsenic in Water" && (<CountyEPHCompare measure={"Arsenic in Water"} measureID={769} units={"Annual Mean Concentration of Arsenic (µg/L)"} />)}
              {currentMeasure === "Asthma in Adults" && (<CountyEPHCompare measure={"Asthma Among Adults"} measureID={1120} units={"Percent of Adults with Asthma"} />)}
              {currentMeasure === "Asthma Hospitalizations" && (<CountyEPHCompare measure={"Asthma Hospitalizations"} measureID={103} units={"Counts of Asthma Hospitalization"} />)}
            {currentMeasure === "DEPH in Water" && (<CountyEPHCompare measure={"DEPH in Water"} measureID={""} units={"Annual Mean Concentration of DEHP (µg/L)"} />)}
              {currentMeasure === "Fertility Rate" && (<CountyEPHCompare measure={"Fertility Rate"} measureID={45} units={"Total Fertility Rate per 1000 women"} />)}
              {currentMeasure === "Heart Attack" && (<CountyEPHCompare measure={"Heart Attack"} measureID={553} units={"Crude Death Rate from Heart Attack among People >=35 Years of Age per 100,000 Population"} />)}
              {currentMeasure === "Infant Mortality" && (<CountyEPHCompare measure={"Infant Mortality"} measureID={279} units={"Infant (<1 Year of Age) Mortality Rate per 1000 Live Births Over a 5-year Period"} />)}
              {currentMeasure === "Low Birthweight" && (<CountyEPHCompare measure={"Low Birthweight"} measureID={36} units={"Percent of Low Birthweight (<2500g) Live Singleton Births"} />)}
            {currentMeasure === "PCE in Water" && (<CountyEPHCompare measure={"PCE in Community Water"} measureID={807} units={"Annual Mean Concentration of PCE (µg/L)"} />)}
            {currentMeasure === "PFAS in Water" && (<CountyEPHCompare measure={"PFAS in Community Water"} measureID={734} units={"CWS with Detections of PFAS Chemicals (PFOS, PFOA, PFNA, PFBS, PFHxS, PFHpA)"} />)}
              {currentMeasure === "Prevalence of Cancer" && (<CountyEPHCompare measure={"Prevalence of Cancer"} measureID={1095} units={"Crude Prevalence of Cancer among Adults >= 18 Years of Age"} />)}
            {currentMeasure === "Radium in Water" && (<CountyEPHCompare measure={"Radium in Water"} measureID={817} units={"Annual Mean Concentration of Radium (pCi/L)"} />)}
            {currentMeasure === "TCE in Water" && (<CountyEPHCompare measure={"TCE in Water"} measureID={812} units={"Annual Mean Concentration of TCE (µg/L)"} />)}
            {currentMeasure === "Uranium in Water" && (<CountyEPHCompare measure={"Uranium in Water"} measureID={822} units={"Annual Mean Concentration of Uranium (µg/L)"} />)}
            {/*CHANGED TP COUNTY - double check!*/}
            {currentMeasure === "Premature Birth" && (<CountyEPHCompare measure={"Premature Birth"} measureID={30} units={"Percent of Preterm (<37 Weeks Gestation) Live Singleton Births"} />)}

            </div>
          </div>
        </div> {/*data reps*/}
      </div>
    </div> //datacomp
  )

}


export default DataComp;