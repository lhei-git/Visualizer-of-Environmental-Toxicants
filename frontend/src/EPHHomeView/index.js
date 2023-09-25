import "./index.css";
import EPHChart from "../EPHCharts/index.js"
const React = require("react");

function EPHHome() {
  return (
    <div className="eph-container">
      <EPHChart/>
    </div>
  );
}

export default EPHHome;
