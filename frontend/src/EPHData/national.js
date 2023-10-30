//blueprint to display national data
//created by Katherine O'Donnell
import "./index.css";
import "./national.css";

import NationalTimeSeries from "../EPHCharts/national";
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
const React = require("react");

const NationalData = ({measure, units, description}) => {
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
    

    return(
        <div className="national-container">
            <h1>{measure}</h1>
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

            <p className="eph-description">{description}</p>
        </div>
    );
}

NationalData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
    description: PropTypes.string.isRequired,         //data description

  };

export default NationalData;