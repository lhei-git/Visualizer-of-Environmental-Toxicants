import "./index.css";
import EPHChart from "../EPHCharts/index.js"
import NationalTimeSeries from "../EPHCharts/national";
import NationalData from "./national";
import AsthmaChart from "../EPHCharts/asthma";
import CancerChart from "../EPHCharts/cancer";
import { useEffect, useState, useReducer } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
import EPHThematicMapView from "../EPHThematicMapView";
import SimpleMap from "../EPHMapView/index"
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
  /* Initial state of app */
const initialState = {
  map: JSON.parse(sessionStorage.getItem("map")),
  filters: {
    chemical: "all",
    pbt: false,
    carcinogen: false,
    releaseType: "all",
    /*sets initial state to latest year*/
    year: 2022,
  },
  errorMessage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setMap":
      /* Store latest searched location in session */
      sessionStorage.setItem("map", JSON.stringify(action.payload));
      return {
        ...state,
        map: action.payload,
      };
    case "setFilters":
      const newFilters = Object.assign({}, action.payload);
      return { ...state, filters: newFilters };


    case "setErrorMessage":
      return { ...state, errorMessage: action.payload };
    default:
      throw new Error();
  }
};

const setMap = (payload) => ({ type: "setMap", payload });
const setFilters = (payload) => ({ type: "setFilters", payload });
const setErrorMessage = (payload) => ({ type: "setErrorMessage", payload });
const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="health-outcomes-container">
      {containerColumnLeftClose && (
        <div className="container-column">
          <button className="close-button-left" onClick={toggleLeftCloseButton}>
              X
          </button>
          <h2>Health Indicators</h2>
          <ul>
            <li onClick={() => chooseTab(0)} className={currentTab === 0 ? "active" : ""}><a href="#">Arsenic in water</a></li> {/* 0 */}
            <li onClick={() => chooseTab("1")} className={currentTab === "1" ? "active" : ""}><a href="#">Asthma</a></li> {/* 1 */}
            <li onClick={() => chooseTab("2")} className={currentTab === "2" ? "active" : ""}><a href="#">Bisphenol and paraben in urine</a></li> {/* 2 */}
            <li><a href="#">Cancer</a></li> {/* 3 */}
            <li><a href="#">Childhood cancer</a></li> {/* 4 */}
            <li><a href="#">Fertility rate</a></li> {/* 5 */}
            <li><a href="#">Heart attack</a></li> {/* 6 */}
            <li><a href="#">Infant mortality</a></li> {/* 7 */}
            <li onClick={() => chooseTab("8")} className={currentTab === "8" ? "active" : ""}><a href="#">Lead in blood</a></li> {/* 8 */}
            <li><a href="#">Low birthweight</a></li> {/* 9 */}
            <li onClick={() => chooseTab("10")} className={currentTab === "10" ? "active" : ""}><a href="#">Metals in urine</a></li> {/* 10 */}
            <li><a href="#">PCE in water</a></li> {/* 11 */}
            <li onClick={() => chooseTab("12")} className={currentTab === "12" ? "active" : ""}><a href="#">Pesticides in urine</a></li> {/* 12 */}
            <li onClick={() => chooseTab("13")} className={currentTab === "13" ? "active" : ""}><a href="#">PFAS in blood</a></li> {/* 13 */}
            <li><a href="#">PFAS in water</a></li> {/* 14 */}
            <li onClick={() => chooseTab("15")} className={currentTab === "15" ? "active" : ""}><a href="#">Phthalates in urine</a></li> {/* 15 */}
            <li><a href="#">Premature birth</a></li> {/* 16 */}
            <li><a href="#">Radium in water</a></li> {/* 17 */}
            <li><a href="#">TCE in water</a></li> {/* 18 */}
            <li><a href="#">Uranium in water</a></li> {/* 19 */}
          </ul>
        </div>
      )}
      
      {/*national measures*/}
      {currentTab === "8" && ( <NationalData measure={"lead in blood"} units={"Concentration (micrograms/deciliter)"}/> )}
      {currentTab === "10" && ( <NationalData measure={"metals in urine"} units={"Concentration (micrograms/gram)"}/> )}
      {currentTab === "15" && ( <NationalData measure={"Phthalate Metabolites in urine (creatinine corrected)"} units={"Concentration (micrograms/gram)"}/> )}
      {currentTab === "2" && (<NationalData measure={"Bisphenol and paraben in urine"} units={"Concentration (micrograms/gram)"}/>)}
      {currentTab === "13" && (<NationalData measure={"PFAS in blood"} units={"Concentration (micrograms/liter)"}/>)}
      {currentTab === "12" && (<NationalData measure={"Pesticides in urine"} units={"Concentration (micrograms/gram)"}/>)}
      {/* state measures */}
      {currentTab === "1" && ( <SimpleMap map={state.map}/> )}
  </div>
  

  );
}


export default EPHHome;

