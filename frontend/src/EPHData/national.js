//blueprint to display national data
//created by Katherine O'Donnell
import "./index.css";
import "./national.css";

import NationalTimeSeries from "../EPHCharts/national";
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
const React = require("react");

const NationalData = ({measure, units, description}) => {
    const [currentTab, setCurrentTab] = React.useState(
        parseInt(sessionStorage.getItem("currentTab")) || 0
    );
      
    function chooseTab(i) {
        sessionStorage.setItem("currentTab", i);
        setCurrentTab(i);
    }

    useEffect(() => {
        chooseTab(1); //default50th percentile
      }, []); // empty dependency array so effect runs only once

    return(
        <div className="national-container">
            <h1>{measure}</h1>
            <div className="selector">
                <ul>
                    <li onClick={() => chooseTab(1)} className={currentTab === 1 ? "active" : ""}>50th Percentile</li>
                    <li onClick={() => chooseTab(2)} className={currentTab === 2 ? "active" : ""}>95th Percentile</li>
                </ul>
            </div>
            {currentTab === 1 && (  <NationalTimeSeries size={{width:800, height:400 }} measure={measure} units={units} percentile={1}/>)}
            {currentTab === 2 && (  <NationalTimeSeries size={{width:800, height:400 }} measure={measure} units={units} percentile={2}/>)}


            <p>{description}</p>
        </div>
    );
}

NationalData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
    description: PropTypes.string.isRequired,         //data description

  };

export default NationalData;