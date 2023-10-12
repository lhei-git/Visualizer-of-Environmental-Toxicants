import "./index.css";
import EPHChart from "../EPHCharts/index.js";
import {useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
const React = require("react");



function EPHData() {
  
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
        <EPHChart/>
      </div>
    </div>
  );
}


export default EPHData;