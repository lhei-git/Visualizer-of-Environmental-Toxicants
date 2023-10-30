import React from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
  } from 'react-simple-maps';
import { useEffect, useState } from "react";
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { getLocationString } from '../helpers';
import "./index.css"


const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

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


const PrevalenceCancer = ({ map }) => {
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState([]);

    const dataForEachYear = (year) => {
        setSelectedYear(year);
            axios.get(`https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1095/2/all/all/1/${year}/0/0`)
            .then((response) => {
                setData(response.data.tableResult);
            })
        .catch((error) => {
            console.error("error:", error);
          });
    }

    useEffect(() => {
        if (selectedYear) {
          dataForEachYear(selectedYear);
        }
      }, [selectedYear]);

      return (
        <div className='mapView'>
         <div className='container'>
          {/*return data for asthma in children for the typed in location*/}
          <h2>Prevalence of Cancer near {" "} {getLocationString(map, true)}</h2>
          </div>
          <div className="dropdown">
            <label> Year: </label>
            <select
              value={selectedYear}
              onChange={(e) => dataForEachYear(e.target.value)}
            >
              <option value=""> Select Year </option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
            </select>
          </div>
    
    <ComposableMap
      projection="geoAlbers"
      projectionConfig={{
        scale: 1000
      }}
    >

      <ZoomableGroup center={[map.center.lng, map.center.lat]} zoom={3}>
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
      </ZoomableGroup>
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
  <h2></h2>
  <div className='measureDescription'>
  </div>
  <span className='questionMark'>ⓘ</span>
  <div className='tooltip'>
  Data are from the Population Level Analysis and Community Estimates (PLACES) Project (https://www.cdc.gov/places/index.html), which is an expansion of the original 500 Cities Project. The original project was launched by the Centers for Disease Control and Prevention (CDC) in partnerships with the Robert Wood Johnson Foundation (RWJF) and CDC Foundation.
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
    export default PrevalenceCancer;