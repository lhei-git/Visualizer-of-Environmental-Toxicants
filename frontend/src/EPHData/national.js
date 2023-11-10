//blueprint to display national data
//created by Katherine O'Donnell
import "./index.css";
import "./national.css";

import NationalTimeSeries from "../EPHCharts/national";
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
const React = require("react");


//calling NationalData on the eph page will generate a data layout for any measure selected
//NationalData returns a .jsx layout with a header, time series graph, filters, and custom description for each national measure
const NationalData = ({measure, units}) => {
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
        <div className="national-container">
            <h1>{measure +" (national data)"}</h1>
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
                        <option value={16}>U.S. Population</option> {/*api endpoint demographic ID = 16 for U.S. pop*/}
                        <option value={9}>Females</option> {/*api endpoint demographic ID = 9 for female data*/}
                        <option value={10}>Males</option> {/*api endpoint demographic ID = 10 for male data*/}
                        <option value={1}>1-5 Years</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                        <option value={4}>6-11 Years</option> {/*api endpoint demographic ID = 1 for 6-11 y/o*/}
                        <option value={5}>12-19 Years</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                        <option value={7}>20+ Years</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                        <option value={11}>All Hispanics</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                        <option value={12}>Mexican Americans</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                        <option value={13}>Non-Hispanic Asians</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                        <option value={14}>Non-Hispanic Blacks</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                        <option value={15}>Non-Hispanic Whites</option> {/*api endpoint demographic ID = 1 for 1-5 y/o*/}
                    </select>
                </div>
            </div>
            {/*code below changes data representation based on filter changes*/}
            <div className = "time-series">
            {selectedPercentile === 1 && (
                <NationalTimeSeries
                size={{ width: 800, height: 400 }}
                measure={measure}
                units={units}
                percentile={1}
                demographic={selectedDemographic}
                />
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
        </div>
    );
}

NationalData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
};

var samples = "Biomonitoring is conducted via individual and pooled blood or urine samples tested by CDC scientists. Samples have been collected from individuals across teh United States that took part in the CDC's National Health and Nutrition Examination Survey (NHANES). The NHANES study is designed so that the sample measures of chemicals in participants can be representatives of exposures in the entire U.S. civilian population, and the data can be filtered to represent smaller demographic groups.";

//diff info passed to the 'about data' section for each measure 
var details = {
    "Lead in Blood": {
        desc: "lead in blood, in micrograms of lead per liter of blood. ",
        lod: "The LOD (µg/dL) for Lead for the Survey years 1999-2000, 2001-2002, 2003-2004, 2005-2006, 2007-2008, 2009-2010, 2011-2012, 2013-2014 and 2015-2016 are the following: 0.3, 0.3, 0.28, 0.25, 0.25, 0.25, 0.25, 0.07 and 0.07, respectively."
    },
    "Metals in Urine":  {
        desc: "arsenic in urine, in micrograms of arsenic per gram of urine. ",
        lod: ""
    },
    "Phthalate Metabolites in Urine (creatinine corrected)": {
        desc: "phthalate metabolites in urine, in micrograms of MBzP per gram of urine. ",
        lod: ""
    },
    "Bisphenol and Paraben in Urine": {
        desc: "bisphenol and paraben in urine, in micrograms of BPA per gram of urine. ",
        lod: ""
    },
    "PFAS in Blood": {
        desc: "PFAS in blood,  in micrograms of PFOS per liter of blood. ",
        lod: ""
    },
    "Pesticides in Urine": {
        desc: "pesticides in urine, in micrograms of OPM per gram of urine. ",
        lod: ""
    }
}



export default NationalData;