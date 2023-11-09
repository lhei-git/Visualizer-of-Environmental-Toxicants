//blueprint to display state data
//created by Katherine O'Donnell, added map code from Farzana Israt
import "./index.css";
import StateTimeSeries from "../EPHCharts/state";
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
const React = require("react");


//calling StateData on the eph page will generate a data layout for any measure selected
const StateData = ({measureID, units}) => {
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
//end of filter code

//create date object to be used in data citation - shows that the app pulls from the EPH API the day the user is accessing the site
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    //.jsx layout
    return(
        <div className="state-container">
            <h1>measure</h1>
            <div className="filter-container">
                <div className="percentile-filter">
                    <p>Select a percentile estimate:</p>
                    <select value={selectedPercentile} onChange={(e) => chooseFilters(parseInt(e.target.value), selectedDemographic)}>
                        {/*in API endpoints, percentileID=1 for 50th, 2 for 95th. 'value' passed as percentile id */}
                        <option value={1}>50th percentile</option>
                        <option value={2}>95th percentile</option>
                    </select>
                </div>
                <div className="demographic-filter">
                    <p>Select a demographic group:</p>
                    <select value={selectedDemographic} onChange={(e) => chooseFilters(selectedPercentile, parseInt(e.target.value))}>
                        {/*value number passed as demographic id */}
                        
                    </select>
                </div>
            </div>
            {/*code below changes data representation based on filter changes*/}
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

        </div>
    );
}

StateData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
};





export default StateData;