import "./index.css";

import NationalData from "./national";
import { useEffect, useState, useReducer } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import SimpleMap from "../EPHMapView"
import EPHThematicStateMap from "../EPHThematicStateMap";
import PropTypes from "prop-types";
import PFASWater from "../EPHMapView/pfas in water";
import PCEWater from "../EPHMapView/pce in water";
import DEPHWater from "../EPHMapView/deph in water";
import RadiumWater from "../EPHMapView/radium in water";
import TCEWater from "../EPHMapView/tce in water";
import PrevalenceCancer from "../EPHMapView/prevalence of cancer";
import AdultAsthma from "../EPHMapView/AdultAsthma";
import UraniumWater from "../EPHMapView/uranium in water";
import HospitalAsthma from "../EPHMapView/HospitalAsthma";
import FertilityRate from "../EPHMapView/FertilityRate";
import InfantMortality from "../EPHMapView/InfantMortality";
import HeartAttack from "../EPHMapView/HeartAttack";
import LowBirthweight from "../EPHMapView/LowBirthweight";
import Prematurity from "../EPHMapView/Prematurity";
import ArsenicWater from "../EPHMapView/ArsenicWater";
import ChildhoodLeukemia from "../EPHMapView/ChildhoodCancerLeukemia";
import ChildhoodBrain from "../EPHMapView/ChildhoodBrain";

const React = require("react");



function EPHHome(map) {
  /*created to make the close button on left column functional*/
  const [containerColumnLeftClose, setLeftCloseButton] = useState(true);
  const toggleLeftCloseButton = () => {
    setLeftCloseButton(!containerColumnLeftClose);
  };

  const [currentTab, setCurrentTab] = React.useState(
    /* stores which tab user was last on*/
    parseInt(sessionStorage.getItem("currentTab")) || "0"
  );

 
  function chooseTab(i) {
    sessionStorage.setItem("currentTab", i);
    setCurrentTab(i);
  }

  useEffect(() => {
    // Set the default measure when EPHHome is loaded
    chooseTab("0"); //default bisphenol, change to arsenic ASAP
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
      {/* Amrita - Reordered so that EPH content stays on the right of the sidebar */}
      <div className="eph-national-container">
        {/*national measures*/}
        {currentTab === "8" && ( <NationalData measure={"lead in blood"} units={"Concentration (micrograms/deciliter)"}/> )}
        {currentTab === "10" && ( <NationalData measure={"metals in urine"} units={"Concentration (micrograms/gram)"}/> )}
        {currentTab === "15" && ( <NationalData measure={"Phthalate Metabolites in urine (creatinine corrected)"} units={"Concentration (micrograms/gram)"}/> )}
        {currentTab === "2" && (<NationalData measure={"Bisphenol and paraben in urine"} units={"Concentration (micrograms/gram)"}/>)}
        {currentTab === "13" && (<NationalData measure={"PFAS in blood"} units={"Concentration (micrograms/liter)"}/>)}
        {currentTab === "12" && (<NationalData measure={"Pesticides in urine"} units={"Concentration (micrograms/gram)"}/>)}
        
        {/* county measures */}
        
        {currentTab === "0" && ( <ArsenicWater map={state.map}/> )}
        {currentTab === "1" && ( <AdultAsthma map={state.map}/> )}
        {currentTab === "3" && ( <PrevalenceCancer map={state.map}/> )}
        {currentTab === "5" && ( <FertilityRate map={state.map}/> )}
        {currentTab === "6" && ( <HeartAttack map={state.map}/> )}
        {currentTab === "7" && ( <InfantMortality map={state.map}/> )}
        {currentTab === "9" && ( <LowBirthweight map={state.map}/> )}
        {currentTab === "11" && ( <PCEWater map={state.map}/> )}
        {currentTab === "14" && ( <PFASWater map={state.map}/> )}
        {currentTab === "16" && ( <Prematurity map={state.map}/> )}
        {currentTab === "17" && ( <RadiumWater map={state.map}/> )}
        {currentTab === "18" && ( <TCEWater map={state.map}/> )}
        {currentTab === "19" && ( <UraniumWater map={state.map}/> )}
        {currentTab === "20" && ( <HospitalAsthma map={state.map}/> )}
        {currentTab === "21" && ( <DEPHWater map={state.map}/> )}

        {/* state measures */}
        {currentTab === "22" && ( <SimpleMap map={state.map}/> )} 
        {currentTab === "4" && ( <ChildhoodLeukemia map={state.map}/> )} 
        {currentTab === "23" && ( <ChildhoodBrain map={state.map}/> )} 
      </div>
      <div className="health-outcomes-sidebar">
      {containerColumnLeftClose && (
        <div className="container-column">
          
          <h2>Select a Health Issue</h2>
          <ul>
            <li onClick={() => chooseTab("0")} className={currentTab === 0 ? "active" : ""}><a href="#">Arsenic in water</a></li> {/* 0 */}
            <li onClick={() => chooseTab("1")} className={currentTab === "1" ? "active" : ""}><a href="#">Asthma in Adults</a></li> {/* 1 */}
            <li onClick={() => chooseTab("22")} className={currentTab === "22" ? "active" : ""}><a href="#">Asthma in Children</a></li>
            <li onClick={() => chooseTab("20")} className={currentTab === "20" ? "active" : ""}><a href="#">Asthma Hospitalizations</a></li>
            <li onClick={() => chooseTab("2")} className={currentTab === "2" ? "active" : ""}><a href="#">Bisphenol and paraben in urine</a></li> {/* 2 */}
            <li onClick={() => chooseTab("3")} className={currentTab === "3" ? "active" : ""}><a href="#">Prevalence of Cancer</a></li> {/* 3 */}
            <li onClick={() => chooseTab("23")} className={currentTab === "23" ? "active" : ""}><a href="#">Childhood Cancer Brain & Central Nervous System</a></li>
            <li onClick={() => chooseTab("4")} className={currentTab === "4" ? "active" : ""}><a href="#">Childhood cancer Leukemia</a></li> {/* 4 */}
            <li onClick={() => chooseTab("21")} className={currentTab === "21" ? "active" : ""}><a href="#">DEPH in Water</a></li>
            <li onClick={() => chooseTab("5")} className={currentTab === "5" ? "active" : ""}><a href="#">Fertility rate</a></li> {/* 5 */}
            <li onClick={() => chooseTab("6")} className={currentTab === "6" ? "active" : ""}><a href="#">Heart attack</a></li> {/* 6 */}
            <li onClick={() => chooseTab("7")} className={currentTab === "7" ? "active" : ""}><a href="#">Infant mortality</a></li> {/* 7 */}
            <li onClick={() => chooseTab("8")} className={currentTab === "8" ? "active" : ""}><a href="#">Lead in blood</a></li> {/* 8 */}
            <li onClick={() => chooseTab("9")} className={currentTab === "9" ? "active" : ""}><a href="#">Low birthweight</a></li> {/* 9 */}
            <li onClick={() => chooseTab("10")} className={currentTab === "10" ? "active" : ""}><a href="#">Metals in urine</a></li> {/* 10 */}
            <li onClick={() => chooseTab("11")} className={currentTab === "11" ? "active" : ""}><a href="#">PCE in water</a></li> {/* 11 */}
            <li onClick={() => chooseTab("12")} className={currentTab === "12" ? "active" : ""}><a href="#">Pesticides in urine</a></li> {/* 12 */}
            <li onClick={() => chooseTab("13")} className={currentTab === "13" ? "active" : ""}><a href="#">PFAS in blood</a></li> {/* 13 */}
            <li onClick={() => chooseTab("14")} className={currentTab === "14" ? "active" : ""}><a href="#">PFAS in water</a></li> {/* 14 */}
            <li onClick={() => chooseTab("15")} className={currentTab === "15" ? "active" : ""}><a href="#">Phthalates in urine</a></li> {/* 15 */}
            <li onClick={() => chooseTab("16")} className={currentTab === "16" ? "active" : ""}><a href="#">Premature birth</a></li> {/* 16 */}
            <li onClick={() => chooseTab("17")} className={currentTab === "17" ? "active" : ""}><a href="#">Radium in water</a></li> {/* 17 */}
            <li onClick={() => chooseTab("18")} className={currentTab === "18" ? "active" : ""}><a href="#">TCE in water</a></li> {/* 18 */}
            <li onClick={() => chooseTab("19")} className={currentTab === "19" ? "active" : ""}><a href="#">Uranium in water</a></li> {/* 19 */}
          </ul>
        </div>
      )}
            </div>
      {/*
      {currentTab === "19" && ( 
        map && (
          !["US", "DC"].includes(map.state) && (
      <EPHThematicStateMap 
        stateName={map.state}
        ></EPHThematicStateMap> )))}
          */}
        
      
  </div>
  

  );
}



export default EPHHome;

