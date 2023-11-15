//blueprint to display state data
//created by Katherine O'Donnell, added map code from Farzana Israt & table code from Taimee Hassan
import "./index.css";
import "./state.css"
import StateTimeSeries from "../EPHCharts/state";
import StateTable from "../EPHTable/state";
import {useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import SimpleMap from "../EPHMapView";
import ChildhoodBrain from "../EPHMapView/ChildhoodBrain";
import ChildhoodLeukemia from "../EPHMapView/ChildhoodCancerLeukemia";
const React = require("react");
const {getLocationParents, getYearString} = require("../helpers");



//calling StateData on the eph page will generate a data layout for any measure selected
const StateData = ({measure, measureID, units}) => {
//this section of code handles filter changes
    const [selectedPercentile, setSelectedPercentile] = React.useState(
        parseInt(sessionStorage.getItem("currentTab")) || 1
    );
    const [selectedDemographic, setSelectedDemographic] = React.useState(
        16 // Set an initial value for demographic filter
      );
    function chooseFilters(percentile, demographic) {
        sessionStorage.setItem("selectedPercentile", percentile);
        setSelectedDemographic(demographic);
        setSelectedPercentile(percentile);
    }
    useEffect(() => {
        chooseFilters(1, 16); //default 50th percentile, us population
      }, []); // empty dependency array so effect runs only once
    //below code pulls searched location from app session storage/
    // Initial state of app 
    const initialState = {
        map: JSON.parse(sessionStorage.getItem("map")),
        filters: {
        chemical: "all",
        pbt: false,
        carcinogen: false,
        releaseType: "all",
        //sets initial state to latest year/
        year: 2022,
        },
        errorMessage: "",
    };
    const reducer = (state, action) => {
        switch (action.type) {
            case "setMap":
            // Store latest searched location in session /
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
    const [state] = useReducer(reducer, initialState);
    //end of storage retrieval code

    //get name of searched state from session storage
    const stateName = getLocationParents(state.map, "stateLong");

    //create date object to be used in data citation - shows that the app pulls from the EPH API the day the user is accessing the site
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    //.jsx layout
    return(
        <div className="state-container">
            <h1>{measure} in {stateName}</h1>
            {/*change time series info based on filter changes*/}
            <div className = "time-series">
                {selectedPercentile === 1 && (
                    <StateTimeSeries
                    size={{ width: 800, height: 400 }}
                    measureID={measureID}
                    units={units}
                    percentile={1}
                    demographic={selectedDemographic}
                    />
                )}
                {selectedPercentile === 2 && (
                    <StateTimeSeries
                    size={{ width: 800, height: 400 }}
                    measureID={measureID}
                    units={units}
                    percentile={2}
                    demographic={selectedDemographic}
                    />
                )}
            </div>
            <p>add description for data here</p>
            <div className = "map-container">
                {measureID === 587 && (<SimpleMap map={state.map}/>)} {/*asthma == 587*/}
                {measureID === 67 && (<ChildhoodBrain map={state.map}/> )} {/*67 == brain/nerv cancer */}
                {measureID === 71 && (<ChildhoodLeukemia map={state.map}/> )} {/*leukemia == 71*/}
            </div>
            <div className="eph-table-container">
                <StateTable measureID={measureID} />
            </div>
        </div>
    );
}

StateData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    measureID: PropTypes.number.isRequired,       //ID of measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
};





export default StateData;