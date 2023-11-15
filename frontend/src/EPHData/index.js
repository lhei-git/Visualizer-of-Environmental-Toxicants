import "./index.css";
import NationalData from "./national";
import StateData from "./state"
import CountyData from "./county";
import { useEffect, useState, useReducer } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import SimpleMap from "../EPHMapView"
import EPHThematicStateMap from "../EPHThematicStateMap";
import EPHThematicWaterStateMap from "../EPHThematicStateView(Water)";
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
import EPHTable from "../EPHTable";


const React = require("react");


//returns .jsx layout for the entire EPH data viewing page
function EPHHome({map}) {
  /*created to make the close button on left column functional*/
  const [containerColumnLeftClose, setLeftCloseButton] = useState(true);
  const toggleLeftCloseButton = () => {
    setLeftCloseButton(!containerColumnLeftClose);
  };

  const [currentTab, setCurrentTab] = React.useState(
    /* stores which tab user was last on*/
    parseInt(sessionStorage.getItem("currentTab")) || "0"
  );


  // Initial State to hold the search bar input created by Al-Taimee
  const [searchedValueInput, setSearchBarInput] = useState("");
   
  // Store the original list items for resetting created by Al-Taimee
  const containerColumnList = Array.from(
    document.querySelectorAll(".container-column ul li")
  );
  

  // Function to handle the search bar input changes created by Al-Taimee
  const handleSearchBar = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchBarInput(inputValue);
    updateSearchBarResults(inputValue);
  };

  // Function to update the search results based on user input created by Al-Taimee
  function updateSearchBarResults(inputValue) {
    containerColumnList.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(inputValue)) {
        item.style.display = "block"; // Show matching items
      } else {
        item.style.display = "none"; // Hide non-matching items
      }
    });
  }

  // Listen for changes in the search input and reset the list if it's cleared created by Al-Taimee
  useEffect(() => {
    if (searchedValueInput === "") {
      clearList();
    }
  }, [searchedValueInput]);

  // Function to reset the list to its original state created by Al-Taimee
  function clearList() {
    containerColumnList.forEach((item) => {
      item.style.display = "block"; // Show all items
    });
  }

  // Add event listeners to the list items to handle item clicks created by Al-Taimee
  containerColumnList.forEach((item) => {
    item.addEventListener("click", () => {
      // Handle item click here, for example:
      const clickedItemText = item.textContent;
      // Do something with the clicked item data
      console.log(`Clicked on item: ${clickedItemText}`);
    });
  });


 
  function chooseTab(i) {
    sessionStorage.setItem("currentTab", i);
    setCurrentTab(i);
  }

  // Scroll to the bottom of the page
    const scrollToBottom = () => {
      window.scrollTo(0, document.body.scrollHeight);
    };

    // Scroll to the top of the page
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

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
const [visible, setVisible] = useState(false);

// Taimee - Scroll to the bottom of the page
const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

// Taimee - Scroll to the top of the page
const scrollToTop = () => {
  window.scrollTo(0, 0);
};

  return (
    
    <div className="health-outcomes-container">
        {/* Taimee - Buttons to scroll up and down on page 
            Amrita - Moved button to be on EPH page only */}
        <div className="scroll-btn-container">
        <button className="scroll-btn-top" onClick={scrollToTop}>
          Scroll to Top
        </button>
        <button className="scroll-btn-bottom" onClick={scrollToBottom}>
          Scroll to Bottom
        </button>
      </div>
      
      {/* Amrita - Reordered so that EPH content stays on the right of the sidebar */}
      <div className="eph-national-container">
        {/*national measures*/}
        {currentTab === "8" && ( <NationalData measure={"Lead in Blood"} units={"Concentration (micrograms/deciliter)"}  measureID={858}/> )}        
        {currentTab === "10" && ( <NationalData measure={"Metals in Urine"} units={"Concentration (micrograms/gram)"} measureID={856}/>)}
        {currentTab === "15" && ( <NationalData measure={"Phthalate Metabolites in Urine (creatinine corrected)"} units={"Concentration (micrograms/gram)"} measureID={863}/>)}
        {currentTab === "2" && (<NationalData measure={"Bisphenol and Paraben in Urine"} units={"Concentration (micrograms/gram)"} measureID={859}/>)}
        {currentTab === "13" && (<NationalData measure={"PFAS in Blood"} units={"Concentration (micrograms/liter)"} measureID={826}/>)}
        {currentTab === "12" && (<NationalData measure={"Pesticides in Urine"} units={"Concentration (micrograms/gram)"} measureID={861}/>)}
        
        {/* county measures - change to call <CountyData> */}
        {currentTab === "0" && ( 
        <EPHThematicWaterStateMap 
                yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                level={[1, 2, 3]}
                measure={"Arsenic in Community Water"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicWaterStateMap> )}

         {/*
        {currentTab === "1" && ( 
        <EPHThematicStateMap 
                yearRange={[2020, 2019, 2018]}
                measure={"Asthma Among Adults"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}

        */}
        {currentTab === "1" && (<CountyData measure={"Asthma among Adults"} measureID={1120} units={"units"} />)}

        {currentTab === "3" && ( 
          /*farzana -- making state maps for each measure*/
        <EPHThematicStateMap 
                yearRange={[2020, 2019, 2018]}
                measure={"Prevalence of Cancer"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}
        {currentTab === "5" && ( 
          /*farzana -- making state maps for each measure*/
        <EPHThematicStateMap 
                yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                measure={"Fertility Rate"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}
        {currentTab === "6" && ( 
          /*farzana -- making state maps for each measure*/
        <EPHThematicStateMap 
                yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                gender={[1, 2]}
                measure={"Heart Attack"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}
        {currentTab === "7" && ( 
          /*farzana -- making state maps for each measure*/
        <EPHThematicStateMap 
                yearRange={[2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004]}
                measure={"Infant Mortality"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}
        {currentTab === "9" && ( 
          /*farzana -- making state maps for each measure*/
        <EPHThematicStateMap 
                yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                gender={[1, 2]}
                measure={"Low Birthweight"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}
        {currentTab === "11" && ( 
        <EPHThematicWaterStateMap 
                yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                level={[1, 2, 3]}
                measure={"PCE in Community Water"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicWaterStateMap> )}
        {currentTab === "14" && ( 
        <EPHThematicWaterStateMap 
                yearRange={[2015]}
                contaminant={[1, 2, 3, 4, 5, 6]}
                measure={"PFAS in Community Water"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicWaterStateMap> )}
        {currentTab === "16" && ( 
          /*farzana -- making state maps for each measure*/
        <EPHThematicStateMap 
                yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                gender={[1, 2]}
                measure={"Prematurity"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}
        {currentTab === "17" && ( 
        <EPHThematicWaterStateMap 
                yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                level={[1, 2, 3]}
                measure={"Radium in Community Water"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicWaterStateMap> )}
        {currentTab === "18" && ( 
        <EPHThematicWaterStateMap 
                yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                level={[1, 2, 3]}
                measure={"TCE in Community Water"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicWaterStateMap> )}
        {currentTab === "19" && ( 
        <EPHThematicWaterStateMap 
                yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                level={[1, 2, 3]}
                measure={"Uranium in Community Water"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicWaterStateMap> )}
        {currentTab === "20" && ( 
          /*farzana -- making state maps for each measure*/
        <EPHThematicStateMap 
                yearRange={[2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014]}
                measure={"Hospitalizations from Asthma"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicStateMap> )}
       
        {currentTab === "21" && (
        <EPHThematicWaterStateMap 
                yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                level={[1, 2, 3]}
                measure={"DEPH in Community Water"}
                stateName={map.state}
                stateLongName={map.stateLong}>
        </EPHThematicWaterStateMap>)}


        {/* state measures */}

        {currentTab === "22" && (<StateData measure={"Asthma among Children"} measureID={587} units={"units"} />)} 
        {currentTab === "23" && (<StateData measure={"Brain and Central Nervous System Cancer among Children"} measureID={67} units={"units"} />)} 
        {currentTab === "4" && (<StateData measure={"Leukemia among Children"} measureID={71} units={"units"} />)}         

        {/*
        {currentTab === "22" && ( <SimpleMap map={state.map}/> )} 
        {currentTab === "4" && ( <ChildhoodLeukemia map={state.map}/> )} 
        {currentTab === "23" && ( <ChildhoodBrain map={state.map}/> )} 
        
        */}
      </div>
     
      <div className="health-outcomes-sidebar">
        <div className="container-column">
          {/*Updated sidebar title created by Al-Taimee*/}
          <h2>Health Issues and Toxic Exposures</h2>
          {/*Search bar input field behavior created by Al-Taimee*/}
          <input type="text" placeholder="Search Health Issues" value={searchedValueInput} onChange={handleSearchBar}/>
          <ul>
            
            <li className="boldHeadings">Drinking Water contamination</li>
            <li onClick={() => chooseTab("0")} className={currentTab === "0" ? "active" : ""}><a href="#">Arsenic in Water</a></li> {/* 0 */}
            <li onClick={() => chooseTab("21")} className={currentTab === "21" ? "active" : ""}><a href="#">DEPH in Water</a></li> 
            <li onClick={() => chooseTab("17")} className={currentTab === "17" ? "active" : ""}><a href="#">Radium in Water</a></li> {/* 17 */}
            <li onClick={() => chooseTab("18")} className={currentTab === "18" ? "active" : ""}><a href="#">TCE in Water</a></li> {/* 18 */}
            <li onClick={() => chooseTab("19")} className={currentTab === "19" ? "active" : ""}><a href="#">Uranium in Water</a></li> {/* 19 */}
            <li onClick={() => chooseTab("11")} className={currentTab === "11" ? "active" : ""}><a href="#">PCE in Water</a></li> {/* 11 */}
            <li onClick={() => chooseTab("14")} className={currentTab === "14" ? "active" : ""}><a href="#">PFAS in Water</a></li> {/* 14 */}
            {/*List headings created by Al-Taimee*/}
            <li className="boldHeadings">Asthma</li>
            <li onClick={() => chooseTab("1")} className={currentTab === "1" ? "active" : ""}><a href="#">Asthma among Adults</a></li> {/* 1 */}
            <li onClick={() => chooseTab("22")} className={currentTab === "22" ? "active" : ""}><a href="#">Asthma among Children</a></li>
            <li onClick={() => chooseTab("20")} className={currentTab === "20" ? "active" : ""}><a href="#">Asthma Hospitalizations</a></li>
            
            <li className="boldHeadings">Cancer</li>
            <li onClick={() => chooseTab("3")} className={currentTab === "3" ? "active" : ""}><a href="#">Prevalence of Cancer</a></li> {/* 3 */}
            <li onClick={() => chooseTab("23")} className={currentTab === "23" ? "active" : ""}><a href="#">Childhood Cancer: Brain & Central Nervous System</a></li>
            <li onClick={() => chooseTab("4")} className={currentTab === "4" ? "active" : ""}><a href="#">Childhood Cancer: Leukemia</a></li> {/* 4 */}

            <li className="boldHeadings">Heart Disease and Stroke</li>
            <li onClick={() => chooseTab("6")} className={currentTab === "6" ? "active" : ""}><a href="#">Heart attack</a></li> {/* 6 */}
            <li className="boldHeadings">Reproductive and birth outcomes</li>
            <li onClick={() => chooseTab("7")} className={currentTab === "7" ? "active" : ""}><a href="#">Infant mortality</a></li> {/* 7 */}
            <li onClick={() => chooseTab("9")} className={currentTab === "9" ? "active" : ""}><a href="#">Low birthweight</a></li> {/* 9 */}
            <li onClick={() => chooseTab("5")} className={currentTab === "5" ? "active" : ""}><a href="#">Fertility rate</a></li> {/* 5 */}

            <li className="boldHeadings">National population exposure</li>
            
            <li onClick={() => chooseTab("8")} className={currentTab === "8" ? "active" : ""}><a href="#">Lead in blood</a></li> {/* 8 */}
            <li onClick={() => chooseTab("10")} className={currentTab === "10" ? "active" : ""}><a href="#">Metals in urine</a></li> {/* 10 */}
            <li onClick={() => chooseTab("12")} className={currentTab === "12" ? "active" : ""}><a href="#">Pesticides in urine</a></li> {/* 12 */}
            <li onClick={() => chooseTab("13")} className={currentTab === "13" ? "active" : ""}><a href="#">PFAS in blood</a></li> {/* 13 */}
            <li onClick={() => chooseTab("15")} className={currentTab === "15" ? "active" : ""}><a href="#">Phthalates in urine</a></li> {/* 15 */}
            <li onClick={() => chooseTab("16")} className={currentTab === "16" ? "active" : ""}><a href="#">Premature birth</a></li> {/* 16 */}
            <li onClick={() => chooseTab("2")} className={currentTab === "2" ? "active" : ""}><a href="#">Bisphenol and paraben in urine</a></li> {/* 2 */}

            <li id="extraLink"><a href="https://ephtracking.cdc.gov/">Data from the CDC Environmental Public Health Tracking Network - click here for details</a></li>

          </ul>
        </div>
      </div>
      
  </div>
  

  );
}



export default EPHHome;