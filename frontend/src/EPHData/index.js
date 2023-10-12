import "./index.css";
import EPHChart from "../EPHCharts/index.js"
import AsthmaChart from "../EPHCharts/asthma";
import CancerChart from "../EPHCharts/cancer";
import { useEffect, useState } from "react";
const React = require("react");

function EPHHome() {
  /*created to make the close button on left column functional*/
  const [containerColumnLeftClose, setLeftCloseButton] = useState(true);

  const toggleLeftCloseButton = () => {
    setLeftCloseButton(!containerColumnLeftClose);
  };
  return (
    <div className="health-outcomes-container">
      {containerColumnLeftClose && (
        <div className="container-column">
          <button className="close-button-left" onClick={toggleLeftCloseButton}>
              X
          </button>
          <h2>Health Indicators</h2>
          <ul>
            <li><a href="https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/858/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=25&DemographicId=16&PercentileId=1">Lead in Blood</a></li>
            <li><a href="https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1120/2/all/all/1/2020,2019,2018/0/0">Asthma in children</a></li>
            <li><a href="../EPHCharts/cancer">Childhood Cancer</a></li>
          </ul>
        </div>
      )}
    
    
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
      <div className="lead-header">
        <h1>Asthma</h1>
      </div>
      <div className="chart">
        <AsthmaChart/>
      </div>
      <div className="lead-header">
        <h1>Cancer</h1>
      </div>
      <div className="chart">
        <CancerChart/>
      </div>
    </div>
  </div>
  );
}

export default EPHHome;