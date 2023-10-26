/*Author of file*/
/*Farzana Israt*/

import React, { useState, useEffect } from 'react';
import { getLocationString } from "../helpers";
import axios from 'axios';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import "./index.css"

/*json file for all states*/
const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';


/*get colors*/
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



/*create map*/
const SimpleMap = ({ map }) => {
  const [selectedYear, setSelectedYear] = useState([]);
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState([]);




  /* fetch data for each year*/
  const dataForEachYear = (year) => {
    setSelectedYear(year);

    axios.get(`https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/1/all/all/1/${year}/0/0`)
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
     {/*return data for asthma in children for the typed in location*/}
      <h1>Asthma in Children in {" "}
      {getLocationString(map, true)}</h1>

      {/*user chooses year from dropdown*/}
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
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
          <option value="2011">2011</option>
        </select>
      </div>


    {/*create the react-simple-map*/}
      <ComposableMap
        projection="geoAlbers"
        projectionConfig={{
          scale: 1000
        }}
      >
        {/*zoom into user's searched coordinates*/}
        <ZoomableGroup center={[map.center.lng, map.center.lat]} zoom={3}>
          <Geographies geography={GEOJSON_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateData = data.find((d) => d.geo === geo.properties.name); //making sure state from topojson file matches state from eph api
                const fillColor = stateData ? getColorScale(stateData.dataValue) : '#D6D6DA'; //create shaded map
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: fillColor, stroke: '#000', strokeWidth: 1, outline: "none" },
                      hover: { fill: '#000000', cursor: 'pointer', stroke: '#000', strokeWidth: 2, outline: "none" },
                      pressed: { outline: "none" }
                    }}
                    onMouseEnter={() => {
                      if (stateData) {
                        setSelectedState(stateData);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {/* display percent concentration for the state*/}
      {selectedState && (
        <div className="tooltip">
          <p>Percent Concentration: {selectedState.displayValue}</p>
        </div>
      )}
    </div>
  );
}




export default SimpleMap;