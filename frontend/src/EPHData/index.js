import "./index.css";
import NationalData from "./national";
import StateData from "./state"
import CountyData from "./county";
import { useEffect, useState, useReducer } from "react";
import history from "../history";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import SimpleMap from "../EPHMapView"
import EPHThematicStateMap from "../EPHThematicStateMap";
import EPHThematicWaterStateMap from "../EPHThematicStateView(Water)";
import PropTypes from "prop-types";
import EPHTable from "../EPHTable";


const React = require("react");
const measuresInfo = [
  { name: "Asthma among Children", measureID: 587, units: "Percent of Children with Asthma" },
  { name: "Brain and Central Nervous System Cancer among Children", measureID: 67, units: "units" },
  { name: "Leukemia among Children", measureID: 71, units: "units" },
  // Add more measures as needed
];

//returns .jsx layout for the entire EPH data viewing page
function EPHHome({ map }) {
  /*created to make the close button on left column functional*/
  const [containerColumnLeftClose, setLeftCloseButton] = useState(true);
  const toggleLeftCloseButton = () => {
    setLeftCloseButton(!containerColumnLeftClose);
  };

 

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


  const [currentTab, setCurrentTab] = React.useState("0");

  function chooseTab(i) {
    setCurrentTab(i);
    console.log("tab changed to " + currentTab)
  }


  useEffect(() => {
    // Set the default measure when EPHHome is loaded
    chooseTab("1"); //default arsenic
  }, []); // empty dependency array so effect runs only once

  /* Initial state of app */
const initialState = {
  map: JSON.parse(sessionStorage.getItem("map")) || {state: null},
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

/* Amrita - Page reverts to main page if user opens it in a new tab (instead of giving an error)*/
if (!state.map.state) {
  history.push("/");  // redirect to the search page
  return null;
}

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
    

        {currentTab === "0" && (<CountyData measure={"Arsenic in Community Water"} measureID={769} units={"units"} />)}
        {currentTab === "1" && (<CountyData measure={"Asthma among Adults"} measureID={1120} units={"Percent of Adults with Asthma"} />)}
        {currentTab === "3" && (<CountyData measure={"Prevalence of Cancer"} measureID={1095} units={"units"} />)}
        {currentTab === "5" && (<CountyData measure={"Fertility Rate"} measureID={45} units={"units"} />)}
        {currentTab === "6" && (<CountyData measure={"Heart Attack"} measureID={553} units={"units"} />)}
        {currentTab === "7" && (<CountyData measure={"Infant Mortality"} measureID={279} units={"units"} map={map} />)}
        {currentTab === "9" && (<CountyData measure={"Low Birthweight"} measureID={36} units={"units"} map={map} />)}
        {currentTab === "11" && (<CountyData measure={"PCE in Community Water"} measureID={807} units={"units"} map={map} />)}
        {currentTab === "14" && (<CountyData measure={"PFAS in Community Water"} measureID={734} units={"units"} map={map} />)}        
        {currentTab === "16" && (<CountyData measure={"Prematurity"} measureID={30} units={"units"} />)}

        {currentTab === "17" && (<CountyData measure={"Radium in Community Water"} measureID={817} units={"units"} />)}
        {currentTab === "18" && (<CountyData measure={"TCE in Community Water"} measureID={812} units={"units"} />)}
        {currentTab === "19" && (<CountyData measure={"Uranium in Community Water"} measureID={822} units={"units"} />)}
        {currentTab === "20" && (<CountyData measure={"Hospitalizations from Asthma"} measureID={99} units={"units"} />)}
        {currentTab === "21" && (<CountyData measure={"DEPH in Community Water"} measureID={802} units={"units"} />)}


        {/* state measures */}

        {currentTab === "22" && (<StateData measure={"Asthma among Children"} measureID={587} units={"Percent of Children with Asthma"} />)} 
        {currentTab === "23" && (<StateData measure={"Brain and Central Nervous System Cancer among Children"} measureID={67} units={"units"} />)} 
        {currentTab === "4" && (<StateData measure={"Leukemia among Children"} measureID={71} units={"units"} />)}         

      </div>
     
      <div className="health-outcomes-sidebar">
        <div className="container-column">
          {/*Updated sidebar title created by Al-Taimee*/}
          <h2>Health Issues and Toxic Exposures</h2>
          {/*Search bar input field behavior created by Al-Taimee*/}
          <input type="text" placeholder="Search Health Issues" value={searchedValueInput} onChange={handleSearchBar}/>
          <ul>
            
            {/*List headings created by Al-Taimee*/}
            <li className="boldHeadings">Asthma</li>
            <li onClick={() => chooseTab("1")} className={currentTab === "1" ? "active" : ""}><a href="#">Asthma among Adults</a></li> {/* 1 */}
            <li onClick={() => chooseTab("22")} className={currentTab === "22" ? "active" : ""}><a href="#">Asthma among Children</a></li>
            <li onClick={() => chooseTab("20")} className={currentTab === "20" ? "active" : ""}><a href="#">Asthma Hospitalizations</a></li>
            
            <li className="boldHeadings">Cancer</li>
            <li onClick={() => chooseTab("23")} className={currentTab === "23" ? "active" : ""}><a href="#">Childhood Cancer: Brain & Central Nervous System</a></li>
            <li onClick={() => chooseTab("4")} className={currentTab === "4" ? "active" : ""}><a href="#">Childhood Cancer: Leukemia</a></li> {/* 4 */}
            <li onClick={() => chooseTab("3")} className={currentTab === "3" ? "active" : ""}><a href="#">Prevalence of Cancer</a></li> {/* 3 */}

            <li className="boldHeadings">Drinking Water contamination</li>
            <li onClick={() => chooseTab("0")} className={currentTab === "0" ? "active" : ""}><a href="#">Arsenic in Water</a></li> {/* 0 */}
            <li onClick={() => chooseTab("21")} className={currentTab === "21" ? "active" : ""}><a href="#">DEPH in Water</a></li> 
            <li onClick={() => chooseTab("11")} className={currentTab === "11" ? "active" : ""}><a href="#">PCE in Water</a></li> {/* 11 */}
            <li onClick={() => chooseTab("14")} className={currentTab === "14" ? "active" : ""}><a href="#">PFAS in Water</a></li> {/* 14 */}
            <li onClick={() => chooseTab("17")} className={currentTab === "17" ? "active" : ""}><a href="#">Radium in Water</a></li> {/* 17 */}
            <li onClick={() => chooseTab("18")} className={currentTab === "18" ? "active" : ""}><a href="#">TCE in Water</a></li> {/* 18 */}
            <li onClick={() => chooseTab("19")} className={currentTab === "19" ? "active" : ""}><a href="#">Uranium in Water</a></li> {/* 19 */}

            <li className="boldHeadings">Heart Disease and Stroke</li>
            <li onClick={() => chooseTab("6")} className={currentTab === "6" ? "active" : ""}><a href="#">Heart Attack</a></li> {/* 6 */}

            <li className="boldHeadings">National population exposure</li>
            <li onClick={() => chooseTab("2")} className={currentTab === "2" ? "active" : ""}><a href="#">Bisphenol and Paraben in Urine</a></li> {/* 2 */}
            <li onClick={() => chooseTab("8")} className={currentTab === "8" ? "active" : ""}><a href="#">Lead in Blood</a></li> {/* 8 */}
            <li onClick={() => chooseTab("10")} className={currentTab === "10" ? "active" : ""}><a href="#">Metals in Urine</a></li> {/* 10 */}
            <li onClick={() => chooseTab("12")} className={currentTab === "12" ? "active" : ""}><a href="#">Pesticides in Urine</a></li> {/* 12 */}
            <li onClick={() => chooseTab("13")} className={currentTab === "13" ? "active" : ""}><a href="#">PFAS in Blood</a></li> {/* 13 */}
            <li onClick={() => chooseTab("15")} className={currentTab === "15" ? "active" : ""}><a href="#">Phthalates in Urine</a></li> {/* 15 */}

            <li className="boldHeadings">Reproductive and birth outcomes</li>
            <li onClick={() => chooseTab("5")} className={currentTab === "5" ? "active" : ""}><a href="#">Fertility Rate</a></li> {/* 5 */}
            <li onClick={() => chooseTab("7")} className={currentTab === "7" ? "active" : ""}><a href="#">Infant Mortality</a></li> {/* 7 */}
            <li onClick={() => chooseTab("9")} className={currentTab === "9" ? "active" : ""}><a href="#">Low Birthweight</a></li> {/* 9 */}
            <li onClick={() => chooseTab("16")} className={currentTab === "16" ? "active" : ""}><a href="#">Premature Birth</a></li> {/* 16 */}

            <p className="extraLink"><a href="https://ephtracking.cdc.gov/">View other measures on the CDC Environmental Public Health Tracking Network</a></p>

          </ul>
        </div>
      </div>
    </div>

  );
}



export default EPHHome;