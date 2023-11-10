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
                        <select>
                            <option>Choose a chemical</option>
                        </select>
                        <EPHChart size = {testSize} className="tri-chart"/>
                    </div>
                    <div className="eph-data">
                        <h2>Public Health Data</h2>
                        <select>
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
                        <EPHChart size = {testSize} className="eph-chart"/>
                    </div>
                </div> {/*data reps*/}
            </div>
        </div> //datacomp
    )

}

export default DataComp;