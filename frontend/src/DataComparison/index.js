import "./index.css";
import EPHChart from "../EPHCharts";
import NationalEPHCompare from "./nationalEPHCompare.js";
import React, { useState, useEffect } from 'react';
import Title from "../Title";
import EPHThematicStateMap from "../EPHThematicStateMap";
import PropTypes from "prop-types";
import Filters from "../Filters/index.js";
const geocoder = require("../api/geocoder");
const vetapi = require("../api/vetapi");

const { formatChemical, getLocationString } = require("../helpers");
const { years } = require("../contants");
//created by Katherine O'Donnell

const {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    LineChart,
    Line,
    ResponsiveContainer,
  } = require("recharts");




function DataComp(props){
    const testSize = {width: 600, height: 300};
    const [currentMeasure, setMeasure] = useState(null);
    const [chemicals, setChemicals] = React.useState([]);
/* farzana */
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

    function onFilterChange(event) {
      const target = event.target;
      const filters = Object.assign({}, props.filters);
      const value = target.type === "checkbox" ? target.checked : target.value;
      if (target.name === "year") filters[target.name] = parseInt(value);
      filters[target.name] = value;
      if (["carcinogen", "pbt"].includes(target.name) && target.checked) {
        filters["chemical"] = "all";
      } else if (target.name === "chemical") {
        filters["carcinogen"] = false;
        filters["pbt"] = false;
      }
      props.onFilterChange(filters);
    }

    /* Amrita - Timeline changes based on user's selection in drop-down */
    const handleChange = (event) => {
      setMeasure(event.target.value);
  };

  const handleChemicalChange = (event) => {
    //setChemicals(event.target.value);
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
  
  const handleChemicalChange = (event) => {
    //setChemicals(event.target.value);
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
  
    return(
        <div className="data-comp-container">
            <div className="content-group">
                <div className="comp-header">
                    <h1>Data Comparison</h1>
                </div>
                <div className="data-reps">
                    <div className="tri-data">
                        <h2>Toxicant Release</h2>
                        {/* farzana */}
                        <select
                          name="chemical"
                          value={props.filters.chemical}
                          onChange={onFilterChange}
                          id=""
                        >
                          {getChemicals()}
                        </select>
    
                        <EPHChart size = {testSize} className="tri-chart"/>
                    </div>
                    <div className="eph-data">
                        {/* Amrita - Adding drop-down menu for public health measures */}
                        <h2>Public Health Data</h2>
                        <select onChange={handleChange} value={currentMeasure}>
                            <option>Choose a public health measure</option>
                            <option>Arsenic in water</option>
                            <option>Asthma in Adults</option>
                            <option>Asthma in Children</option>
                            <option>Asthma Hospitalizations</option>
                            <option>Bisphenol and Paraben in Urine</option>
                            <option>Prevalence of Cancer</option>
                            <option>Childhood Cancer Brain & Central Nervous System</option>
                            <option>Childhood Cancer Leukemia</option>
                            <option>DEPH in Water</option>
                            <option>Fertility Rate</option>
                            <option>Heart Attack</option>
                            <option>Infant Mortality</option>
                            <option>Lead in Blood</option>
                            <option>Low Birthweight</option>
                            <option>Metals in Urine</option>
                            <option>PCE in Water</option>
                            <option>Pesticides in Urine</option>
                            <option>PFAS in Blood</option>
                            <option>PFAS in Water</option>
                            <option>Phthalates in Urine</option>
                            <option>Premature Birth</option>
                            <option>Radium in Water</option>
                            <option>TCE in Water</option>
                            <option>Uranium in Water</option>
                        </select>

                        {/* Amrita - Calls timeline from NationalEPHCompare to display timeline for Public Health Data section */}
                        {currentMeasure === "Lead in Blood" && (<NationalEPHCompare measure={"lead in blood"} units={"Concentration (micrograms/deciliter)"}/>)}
                        {currentMeasure === "Metals in Urine" && ( <NationalEPHCompare measure={"metals in urine"} units={"Concentration (micrograms/gram)"}/> )}
                        {currentMeasure === "Phthalate Metabolites in Urine" && ( <NationalEPHCompare measure={"Phthalate Metabolites in urine (creatinine corrected)"} units={"Concentration (micrograms/gram)"}/> )}
                        {currentMeasure === "Bisphenol and Paraben in Urine" && (<NationalEPHCompare measure={"Bisphenol and paraben in urine"} units={"Concentration (micrograms/gram)"}/>)}
                        {currentMeasure === "PFAS in Blood" && (<NationalEPHCompare measure={"PFAS in blood"} units={"Concentration (micrograms/liter)"}/>)}
                        {currentMeasure === "Pesticides in Urine" && (<NationalEPHCompare measure={"Pesticides in urine"} units={"Concentration (micrograms/gram)"}/>)}

                    </div>
                </div> {/*data reps*/}
            </div>
        </div> //datacomp
    )

}


export default DataComp;