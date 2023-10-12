import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';

const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';


function SimpleMap() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const url = "https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/1/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011/0/0";

    axios.get(url)
      .then((response) => {
        setData(response.data.tableResult);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (stateData) => {
    setSelectedState(stateData);
  }

  
  return (
    
    <div className='mapView'>
      
      
    
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
      >
        <Geographies geography={GEOJSON_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateData = data.find((d) => d.geo === geo.properties.name);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: '#D6D6DA' },
                    pressed: { fill: '#F53', cursor: 'pointer' },
                  }}

                  onMouseEnter={() => handleStateClick(stateData)}
                >
                  </Geography>
                
              );
            })
          }
        </Geographies>
      </ComposableMap>
      
      
      {selectedState && (
      <div className="tooltip">
        <p>Percent for {selectedState.year}: {selectedState.displayValue}</p>
      </div> 
    )}
    
    </div>

    
  );
}


export default SimpleMap;
