import "./index.css";

import NationalData from "./national";
import { useEffect, useState, useReducer } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
import EPHThematicMapView from "../EPHThematicMapView";
import SimpleMap from "../EPHMapView/index"
const React = require("react");



function EPHHome() {
  /*created by Taimee to make the close button on left column functional*/
  const [containerColumnLeftClose, setLeftCloseButton] = useState(true);
  const toggleLeftCloseButton = () => {
    setLeftCloseButton(!containerColumnLeftClose);
  };

  const [currentTab, setCurrentTab] = React.useState(
    /* stores which tab user was last on*/
    parseInt(sessionStorage.getItem("currentTab")) || "0"
  );

 
  function chooseMeasure(i) {
    sessionStorage.setItem("currentTab", i);
    setCurrentTab(i);
  }

  useEffect(() => {
    // Set the default measure when EPHHome is loaded
    chooseMeasure("2"); //default bisphenol, change to arsenic ASAP
  }, []); // empty dependency array so effect runs only once

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
      <div className="health-outcomes-sidebar">
      {containerColumnLeftClose && (
        <div className="container-column">
          
          <h2>Health Indicators</h2>
          <ul>
            <li onClick={() => chooseMeasure("0")} className={currentTab === 0 ? "active" : ""}><a href="#">Arsenic in water</a></li> {/* 0 */}
            <li onClick={() => chooseMeasure("1")} className={currentTab === "1" ? "active" : ""}><a href="#">Asthma</a></li> {/* 1 */}
            <li onClick={() => chooseMeasure("2")} className={currentTab === "2" ? "active" : ""}><a href="#">Bisphenol and paraben in urine</a></li> {/* 2 */}
            <li><a href="#">Cancer</a></li> {/* 3 */}
            <li><a href="#">Childhood cancer</a></li> {/* 4 */}
            <li><a href="#">Fertility rate</a></li> {/* 5 */}
            <li><a href="#">Heart attack</a></li> {/* 6 */}
            <li><a href="#">Infant mortality</a></li> {/* 7 */}
            <li onClick={() => chooseMeasure("8")} className={currentTab === "8" ? "active" : ""}><a href="#">Lead in blood</a></li> {/* 8 */}
            <li><a href="#">Low birthweight</a></li> {/* 9 */}
            <li onClick={() => chooseMeasure("10")} className={currentTab === "10" ? "active" : ""}><a href="#">Metals in urine</a></li> {/* 10 */}
            <li><a href="#">PCE in water</a></li> {/* 11 */}
            <li onClick={() => chooseMeasure("12")} className={currentTab === "12" ? "active" : ""}><a href="#">Pesticides in urine</a></li> {/* 12 */}
            <li onClick={() => chooseMeasure("13")} className={currentTab === "13" ? "active" : ""}><a href="#">PFAS in blood</a></li> {/* 13 */}
            <li><a href="#">PFAS in water</a></li> {/* 14 */}
            <li onClick={() => chooseMeasure("15")} className={currentTab === "15" ? "active" : ""}><a href="#">Phthalates in urine</a></li> {/* 15 */}
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
      </div>
      {/* state measures */}
      {currentTab === "1" && ( <SimpleMap map={state.map}/> )}
  </div>
  

  );
}


export default EPHHome;

