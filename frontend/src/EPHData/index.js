import "./index.css";
import EPHChart from "../EPHCharts/index.js"
import AsthmaChart from "../EPHCharts/asthma";
import CancerChart from "../EPHCharts/cancer";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
const React = require("react");



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

