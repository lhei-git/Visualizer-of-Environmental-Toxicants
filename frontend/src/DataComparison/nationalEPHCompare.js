//blueprint to display national data
//created by Katherine O'Donnell
// Amrita - Removed description, table, filters to show only graph in Data Comparison page's Public Health Data section

import "./index.css";
import NationalTimeSeries from "../EPHCharts/national";
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NationalTable from "../EPHTable/national";
const React = require("react");


//calling NationalEPHCompare on the eph page will generate a data layout for any measure selected
//NationalEPHCompare returns a .jsx layout with a header, time series graph, filters, and custom description for each national measure
const NationalEPHCompare = ({measure, units, measureID}) => {
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
        <div className="comp-national-container">
            {/* Amrita - Added US and 50th Percentile to show on top of timeline */}
            <h1>United States</h1>
            <h2> Showing Data Based on 50th Percentile </h2>
            {/* Where filter container would go if needed */}
            {/*code below changes data representation based on filter changes*/}
            <div className = "time-series">
            {selectedPercentile === 1 && (
                <NationalTimeSeries className = "comp-time-series"
                        size={{ width: 800, height: 400 }}
                        measure={measure}
                        units={units}
                        percentile={1}
                        demographic={selectedDemographic} />
                        
            )}
            {selectedPercentile === 2 && (
                <NationalTimeSeries
                size={{ width: 800, height: 400 }}
                measure={measure}
                units={units}
                percentile={2}
                demographic={selectedDemographic}
                />
            )}
            
            </div>
            {/*
             <div className="desc"><p>The time series graph above shows national estimates by year for the average levels of {details[measure].desc}The data comes from the National Report on Human Exposure to Environmental Chemicals (details below).</p>
            <div className="about-data">
                <h2>About the Data</h2>
                <h3>Where is the data from?</h3>
                <p>The data above is provided by the Centers for Disease Control and Prevention, National Center for Health Statistics (NCHS), National Health and Nutrition Examination Survey (NHANES) (http://www.cdc.gov/nchs/nhanes.htm) as presented in the National Report on Human Exposure to Environmental Chemicals. You can find the official updated tables for the report here: http://www.cdc.gov/exposurereport/</p>
                <p>{samples}</p>
                <p>Accessed From: https://ephtracking.cdc.gov/DataExplorer. Accessed on {formattedDate}.</p>
                <h3>What group does the data represent?</h3>
                <p>Data samples are population-weighted, representing the U.S. civilian non-institutionalized Census population. The purpose of weighting the samples is to create unbiased national estimates, meaning that the measures represent the entire U.S. population. </p>
                <p>Each demographic filter changes the scope of data collected to provide data estimates for each measure in different demographic groups.</p>
                <h3>What do the different percentiles mean?</h3>
                <p>Percentiles give us information about the shape of the distribution of various estimated data concentrations. The 50th percentile is the median estimated concentration where half the measured values are greater than and half are less than the 50th percentile estimated concentration. The 95th percentile indicates high-end exposure concentrations, which are at or above the 95th percentile estimated concentration.</p>
                <h3>Limit of detection</h3>
                <p>The limit of detection (LOD) is the smallest amount of substance that can be reliably distinguished from zero. LOD means less than the limit of detection, which may vary for some chemicals by year and by individual sample. {details[measure].lod}</p>
            </div>
            </div>
            
            */}
        </div>
    );
}

NationalEPHCompare.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
    measureID: PropTypes.number.isRequired      //measureID to pass to api endpoint for
};




export default NationalEPHCompare;