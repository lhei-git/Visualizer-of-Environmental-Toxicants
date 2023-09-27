import "./index.css";
import EPHChart from "../EPHCharts/index.js"
const React = require("react");

function EPHHome() {
  return (
    
    <div className="eph-container">
      <div className="lead-header">
        <h1>Lead in Blood</h1>
      </div>
      <div className="chart">
        <EPHChart/>
      </div>
    </div>
  );
}

export default EPHHome;