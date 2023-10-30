//==========================================
// Author: Farzana Israt
//==========================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { getLocationString } from '../helpers';
import "./index.css"
import ReactTooltip from 'react-tooltip';




const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';




function getColorScale(dataValue) {
  return dataValue == null
    ? '#D6D6DA'
    : dataValue < 20
    ? '#bbe9fa'
    : dataValue < 50
    ? '#8bdefc'
    : dataValue < 100
    ? '#62cdf5'
    : '#1ab3eb';
}




const ChildhoodBrain = ({ map }) => {
  const [selectedYear, setSelectedYear] = useState([]);
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  //const EPH_API_KEY = "BDB5CA62-FE5C-4608-A621-D4B198DF7744";



  // Fetch data for each year
  const dataForEachYear = (year) => {
    setSelectedYear(year);

    axios.get(`https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/67/1/all/all/1/${year}/0/0`, )
      .then((response) => {
        setData(response.data.tableResult);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  };




  useEffect(() => {
    if (selectedYear) {
      dataForEachYear(selectedYear);
    }
  }, [selectedYear]);




  return (
    <div className='mapView'>
     <div className='container'>
      {/*return data for asthma in children for the typed in location*/}
      <h2>Childhood Cancer Brain & Central Nervous System</h2>
      </div>
      <div className="dropdown">
        <label> Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => dataForEachYear(e.target.value)}
        >
          <option value=""> Select Year </option>
          <option value="2019">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
          <option value="2011">2011</option>
          <option value="2010">2010</option>
          <option value="2009">2009</option>
          <option value="2008">2008</option>
          <option value="2007">2007</option>
          <option value="2006">2006</option>
          <option value="2005">2005</option>
          <option value="2004">2004</option>
          <option value="2003">2003</option>
          <option value="2002">2002</option>
          <option value="2001">2001</option>
          
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
    <span>0-20</span>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#8bdefc' }}></div>
    <span>20-50</span>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#62cdf5' }}></div>
    <span>50-100</span>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: '#1ab3eb' }}></div>
    <span>100+</span>
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




export default ChildhoodBrain;