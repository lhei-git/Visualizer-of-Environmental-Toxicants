import "./index.css";
/*import EPHChart from "../EPHCharts/index.js"
import AsthmaChart from "../EPHCharts/asthma";
import CancerChart from "../EPHCharts/cancer";*/
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
const React = require("react");

export function EPHChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = 'https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/858/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=25&DemographicId=16&PercentileId=1';

    axios.get(url)
      .then((response) => {
        const newData = response.data.sampleSizeTableResult.map((item) => ({
          year: item.year,
          dataValue: item.dataValue,
        }));
        setData(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="TimeSeries">
      <LeadTimeSeries data={data} />
    </div>
  );


}


export function LeadTimeSeries({ data }) {
    
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid />
      <XAxis dataKey="year" />
      <YAxis>
        <Label 
          style={{textAnchor: "middle"}}
          angle={270} 
          position='insideLeft'
          value={"Concentration (micrograms/deciliter)"}
          margin={200}/>

      </YAxis>
      <Tooltip />
      <Line name="Concentration" type="monotone" dataKey="dataValue" stroke="purple" />
    
    </LineChart>
  );
}



function EPHHome() {
  /*created to make the close button on left column functional*/
  const [containerColumnLeftClose, setLeftCloseButton] = useState(true);
  

  const toggleLeftCloseButton = () => {
    setLeftCloseButton(!containerColumnLeftClose);
  };

  const [currentTab, setCurrentTab] = React.useState(
    /* Stores which tab user was last on. Might be worth taking out */
    parseInt(sessionStorage.getItem("currentTab")) || 0
  );

  /* Setter for current tab */
  function chooseTab(i) {
    sessionStorage.setItem("currentTab", i);
    setCurrentTab(i);
  }
  return (
    <div className="health-outcomes-container">
      {containerColumnLeftClose && (
        <div className="container-column">
          <button className="close-button-left" onClick={toggleLeftCloseButton}>
              X
          </button>
          <h2>Health Indicators</h2>
          <ul>
            <li><a href="#">Arsenic in water</a></li>
            <li><a href="#">Asthma</a></li>
            <li><a href="#">Bisphenol and paraben in urine</a></li>
            <li><a href="#">Cancer</a></li>
            <li><a href="#">Childhood cancer</a></li>
            <li><a href="#">Fertility rate</a></li>
            <li><a href="#">Heart attack</a></li>
            <li><a href="#">Infant mortality</a></li>
            <li><button className="close-button-left" onClick={EPHChart}>Lead in blood</button></li>
            <li><a href="#">Low birthweight</a></li>
            <li><a href="#">Mettals in urine</a></li>
            <li><a href="#">PCE in water</a></li>
            <li><a href="#">Pesticides in urine</a></li>
            <li><a href="#">PFAS in blood</a></li>
            <li><a href="#">PFAS in water</a></li>
            <li><a href="#">Phthalates in water</a></li>
            <li><a href="#">Premature birth</a></li>
            <li><a href="#">Radium in water</a></li>
            <li><a href="#">TCE in water</a></li>
            <li><a href="#">Uranium in water</a></li>
          </ul>
        </div>
      )}
    
    <div className="graph-container">
      <div className="selector">
        <ul>
          <li
            onClick={() => chooseTab(0)}
            className={currentTab === 0 ? "active" : ""}
          >
            Map
          </li>
          <li
            onClick={() => chooseTab(1)}
            className={currentTab === 1 ? "active" : ""}
          >
            Timelines
          </li>
          <li
            onClick={() => chooseTab(2)}
            className={currentTab === 2 ? "active" : ""}
          >
            National Profile
          </li>
        </ul>
      </div>
    </div>
    
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
  </div>
  );
}

export default EPHHome;

