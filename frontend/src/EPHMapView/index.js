/*Author of file: Farzana Israt*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import "./index.css"


//URL to create map
const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';


// Colors for shades of map
function getColorScale(dataValue) {
  //Making this shades of blue to match the theme
  //Make sure to make states that don't have data grey
  return dataValue == null
    ? '#D6D6DA'
    :dataValue < 9
    ? '#bbe9fa'
    : dataValue < 12
    ? '#8bdefc'
    : dataValue < 14
    ? '#62cdf5'
    : '#1ab3eb';
}


const SimpleMap = ({ longitude, latitude }) => {
  const [selectedYear, setSelectedYear] = useState('2011');
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  


  //Fetch data for each year
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
      <h1>Asthma in children</h1>
      {/* dropdown for user to choose year */}
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
          
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000
        }}
      >

        <ZoomableGroup center={[longitude, latitude]} zoom={4}>
        <Geographies geography={GEOJSON_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateData = data.find((d) => d.geo === geo.properties.name);
              const fillColor = stateData ? getColorScale(stateData.dataValue) : '#D6D6DA';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  
                  style={{
                    default: { fill: fillColor, stroke: '#000', 
                    strokeWidth: 1, outline: "none"},
                    hover: { fill: '#000000', cursor: 'pointer', stroke: '#000', strokeWidth: 2, outline: "none" },
                    pressed: { outline: "none"}
                  }}
                  
                  onMouseEnter={() => setSelectedState(stateData)}
                  
                >
                  </Geography>
                  
              );
            })
          }
          
        </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
         
      
      {selectedState && (
        <div className="tooltip">
          <p>Percent Concentration: {selectedState.displayValue}</p>
        </div> 
    
      )}
    </div>

    
  );
}


export default SimpleMap;
