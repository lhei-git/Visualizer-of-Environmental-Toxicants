//==========================================
// Author: Farzana Israt
//==========================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import "./index.css"
import ReactTooltip from 'react-tooltip';


const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

function getColorScale(dataValue) {
  return dataValue == null
    ? '#D6D6DA'
    : dataValue < 9
    ? '#bbe9fa'
    : dataValue < 12
    ? '#8bdefc'
    : dataValue < 14
    ? '#62cdf5'
    : '#1ab3eb';
}

const SimpleMap = ({ map }) => {
  const [selectedYear, setSelectedYear] = useState([]);
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedGenderId, setSelectedGenderId] = useState([]);
  

  const dataForEachYear = (year, genderId) => {
    setSelectedYear(year);

    axios
      .get(`https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/4/all/all/1/${year}/0/0?GenderId=${genderId}`)
      .then((response) => {
        setData(response.data.tableResult);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  };

  useEffect(() => {
    if (selectedYear) {
      dataForEachYear(selectedYear, selectedGenderId);
    }
  }, [selectedYear, selectedGenderId]);

  const handleGenderChange = (event) => {
    setSelectedGenderId(event.target.value);
  };
  
  return (
    <div className='nation-mapView'>
     <div className='container'>
      {/*return data for asthma in children for the typed in location*/}
      <h2>Asthma in Children in U.S.</h2>
      </div>
      <div className="dropdown">
        <label> Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value=""> Select Year </option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
          <option value="2011">2011</option>
        </select>
      </div>
      <div className='dropdown'>
      <label htmlFor="gender">Select Gender:</label>
      <select id="gender" value={selectedGenderId} onChange={handleGenderChange}>
        <option value="">Select a Gender</option>
        <option value="1">Male</option>
        <option value="2">Female</option>
      </select>
      </div>


<ComposableMap
  projection="geoAlbers"
  projectionConfig={{
    scale: 1000
  }}
>
  
  <Geographies geography={GEOJSON_URL}>
    {({ geographies }) =>
      geographies.map((geo) => {
        const stateData = data.find((d) => d.geo === geo.properties.name);
        const fillColor = stateData ? getColorScale(stateData.dataValue) : '#D6D6DA';
        return (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            data-tip={`${geo.properties.name}: ${stateData && stateData.displayValue }`}
            style={{
              default: { fill: fillColor, stroke: '#000', strokeWidth: 1, outline: "none" },
              hover: { fill: fillColor, cursor: 'pointer', stroke: '#000', strokeWidth: 2, outline: "none" },
              pressed: { outline: "none" }
            }}
            
            onMouseEnter={() => {
              ReactTooltip.rebuild();
            }}
          />
        );
      })
    }
  </Geographies>
</ComposableMap>


      <ReactTooltip />
  <div className="legend">
  <h3>Percent Concentration</h3>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#D6D6DA' }}></div>
    <span>Null Data</span>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#bbe9fa' }}></div>
    <span>0-9</span>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#8bdefc' }}></div>
    <span>9-12</span>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#62cdf5' }}></div>
    <span>12-14</span>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#1ab3eb' }}></div>
    <span>14+</span>
  </div>
</div>

<div className='mapDescription'>
  <div className='measureDescription'>
  </div>
  <span className='questionMark'>ⓘ</span>
  <div className='tooltip'>
  Data are from the Behavior Risk Factor Surveillance Survey (BRFSS), a state-based, random-digit-dial telephone survey of the non-institutionalized, civilian U.S. population 18 years of age and older. BRFSS data are self-reported.
  </div>
</div>


{/*
      {selectedState && (
        <div className="tooltip">
          <p>Percent Concentration: {selectedState.displayValue}</p>
        </div>
      )}
      */}
    </div>
  );
}




export default SimpleMap;