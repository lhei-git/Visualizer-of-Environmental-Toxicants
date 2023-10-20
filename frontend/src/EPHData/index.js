import "./index.css";
import EPHChart from "../EPHCharts/index.js"
import AsthmaChart from "../EPHCharts/asthma";
import CancerChart from "../EPHCharts/cancer";
import NationalTimeSeries from "../EPHCharts/national";
import {useState} from 'react';
const React = require("react");



function EPHData() {
  const leadSize = {width:800, height:400 }
  return (
    <div className="eph-container">
      <div className="eph-dropdown">
        <p>Please choose a category: </p>
        <select id="category">
              <option value="lib">Lead in Blood</option>
              <option value="asthma">Asthma</option>
              <option value="cancer">Cancer</option>
        </select>
      </div>
      <h1>Lead in Blood</h1>
      <div className="chart">
        <NationalTimeSeries size={leadSize} measure={"lead in blood"} units={"Concentration (micrograms/deciliter)"}/>
      </div>
      <h1>Metals in Urine</h1>
      <div className="chart">
        <NationalTimeSeries size={leadSize} measure={"metals in urine"} units={"Concentration (micrograms/gram)"}/>
      </div>
      <h1>Phthalate Metabolites in urine (creatinine corrected)</h1>
      <div className="chart">
        <NationalTimeSeries size={leadSize} measure={"Phthalate Metabolites in urine (creatinine corrected)"} units={"Concentration (micrograms/gram)"}/>
      </div>
      <h1>Bisphenol and paraben in urine</h1>
      <div className="chart">
        <NationalTimeSeries size={leadSize} measure={"Bisphenol and paraben in urine"} units={"Concentration (micrograms/gram)"}/>
      </div>
      <h1>PFAS in blood</h1>
      <div className="chart">
        <NationalTimeSeries size={leadSize} measure={"PFAS in blood"} units={"Concentration (micrograms/liter)"}/>
      </div>
      <h1>Pesticides in urine</h1>
      <div className="chart">
        <NationalTimeSeries size={leadSize} measure={"Pesticides in urine"} units={"Concentration (micrograms/gram)"}/>
      </div>
    </div>
  );
}


export default EPHData;