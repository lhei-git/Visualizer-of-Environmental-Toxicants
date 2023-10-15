import "./index.css";
import EPHChart from "../EPHCharts/index.js"
import AsthmaChart from "../EPHCharts/asthma";
import CancerChart from "../EPHCharts/cancer";
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
      <div className="lead-header">
        <h1>Lead in Blood</h1>
      </div>
      <div className="chart">
        <EPHChart size={leadSize}/>
      </div>
      <div className="asthma-header">
        <h1>Asthma</h1>
      </div>
      <div className="chart">
        <AsthmaChart/>
      </div>
      <div className="cancer-header">
        <h1>Cancer</h1>
      </div>
      <div className="chart">
        <CancerChart/>
      </div>
    </div>
  );
}


export default EPHData;