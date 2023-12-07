//blueprint to display state data
//created by Katherine O'Donnell, added map code from Farzana Israt & table code from Taimee Hassan
// Amrita - Removed description and table to show only graph in Data Comparison page's Public Health Data section

import "./index.css";
import StateTimeSeries from "../EPHCharts/state";
import { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
const React = require("react");
const { getLocationParents } = require("../helpers");



//calling StateEPHCompare on the eph page will generate a data layout for any measure selected
const StateEPHCompare = ({ measure, measureID, units }) => {
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
    return (
        <div className="comp-state-container">
            {/* Amrita - Adjusted header to only say stateName and added h2 */}
            <h1>{stateName}</h1>
            <h2> Showing Data Based on 50th Percentile </h2>
            {/*change time series info based on filter changes*/}
            <div className="time-series">
                <StateTimeSeries
                    size={{ width: 800, height: 400 }}
                    measureID={measureID}
                    units={units}
                    percentile={1}
                    demographic={selectedDemographic}
                />
            </div>

        </div>
    );
}

StateEPHCompare.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    measureID: PropTypes.number.isRequired,       //ID of measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
};





export default StateEPHCompare;