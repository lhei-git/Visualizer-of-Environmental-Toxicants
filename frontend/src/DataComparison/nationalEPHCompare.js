//blueprint to display national data
//created by Katherine O'Donnell
// Amrita - Removed description, table, filters to show only graph in Data Comparison page's Public Health Data section

import "./index.css";
import NationalTimeSeries from "../EPHCharts/national";
import { useEffect } from 'react';
import PropTypes from 'prop-types';
const React = require("react");


//calling NationalEPHCompare on the eph page will generate a data layout for any measure selected
//NationalEPHCompare returns a .jsx layout with a header, time series graph, filters, and custom description for each national measure
const NationalEPHCompare = ({ measure, units, measureID }) => {
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
    return (
        <div className="comp-container">
            {/* Amrita - Added US and 50th Percentile to show on top of timeline */}
            <h1>United States</h1>
            <h2> Showing Data Based on 50th Percentile </h2>
            {/* Where filter container would go if needed */}
            {/*code below changes data representation based on filter changes*/}
            <div className = "comp-time-series">
                <NationalTimeSeries className="comp-time-series"
                    size={{ width: 800, height: 400 }}
                    measure={measure}
                    units={units}
                    percentile={1}
                    demographic={selectedDemographic}
                />

            </div>
        </div>
    );
}

NationalEPHCompare.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
    measureID: PropTypes.number.isRequired      //measureID to pass to api endpoint for
};




export default NationalEPHCompare;