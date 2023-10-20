//blueprint to display national data
//created by Katherine O'Donnell
import "./index.css";
import NationalTimeSeries from "../EPHCharts/national";
import {useState} from 'react';
const React = require("react");

const NationalData = ({measure}) => {
    return(
        <div className="national-container">
            <h1>{measure}</h1>
            <NationalTimeSeries size={{width:800, height:400 }} measure={measure}/>
            <p>this is where the description will live</p>
        </div>
    );
}

NationalData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
  };

export default NationalData;