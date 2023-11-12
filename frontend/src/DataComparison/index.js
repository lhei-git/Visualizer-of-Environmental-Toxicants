import "./index.css";
import EPHChart from "../EPHCharts";
import NationalEPHCompare from "./nationalEPHCompare.js";
import React, { useState } from 'react';

import EPHThematicStateMap from "../EPHThematicStateMap";
import PropTypes from "prop-types";
const geocoder = require("../api/geocoder");
const vetapi = require("../api/vetapi");

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

//created by Katherine O'Donnell

function DataComp(){
    const testSize = {width: 600, height: 300};
    const [currentMeasure, setMeasure] = useState(null);

    /* Amrita - Timeline changes based on user's selection in drop-down */
    const handleChange = (event) => {
        setMeasure(event.target.value);
    };
  
    return(
        <div className="data-comp-container">
            <div className="content-group">
                <div className="comp-header">
                    <h1>Data Comparison</h1>
                </div>
                <div className="data-reps">
                    <div className="tri-data">
                        <h2>Toxicant Release</h2>
                        <select>
                            <option>Choose a chemical</option>
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