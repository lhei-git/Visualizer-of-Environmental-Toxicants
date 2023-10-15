import "./index.css";
import EPHChart from "../EPHCharts";
const geocoder = require("../api/geocoder");
const React = require("react");
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
    return(
        <div className="data-comp-container">
            <div className="content-group">
                <div className="comp-header">
                    <h1>Data Comparison</h1>
                </div>
                <div className="data-reps">
                    <div className="tri-data">
                        <h2>Toxicant Release</h2>
                        <h3>Fake graph for testing</h3>
                        <EPHChart size = {testSize} className="tri-chart"/>
                    </div>
                    <div className="eph-data">
                        <h2>Public Health Data</h2>
                        <h3>Lead in Blood</h3>
                        <EPHChart size = {testSize} className="eph-chart"/>
                    </div>
                </div> {/*data reps*/}
            </div>
        </div> //datacomp
    )

}

export default DataComp;