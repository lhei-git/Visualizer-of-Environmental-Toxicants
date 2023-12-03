//==========================================
// Author: Farzana Israt
//==========================================
//some of the structure of this code mimics previous teams' structure in ThematicMap

import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from 'react-simple-maps'
import ReactTooltip from 'react-tooltip';
import "./index.css"

const EPHMap = (props) => {
    const [position, setPosition] = useState({coordinates: [-96, 38], zoom: 1});

      function handleMoveEnd(position) {
        setPosition(position);
      }
      
      const [minValue, setMinValue] = useState(null);
      const [maxValue, setMaxValue] = useState(null);
      useEffect(() => {
        // Calculate minValue and maxValue when data changes
        const dataValues = props.data.map((d) => d.dataValue);
        setMinValue(Math.min(...dataValues));
        setMaxValue(Math.max(...dataValues));
        
      }, [props.data]);

      //Genderate colors for the legend and map for county maps
      function generateColor(value, minValue, maxValue) {
        const percentage = (value - minValue) / (maxValue - minValue);
        const hue = 200; // Blue hue 
        const saturation = 80; // Fixed saturation
        const lightness = 100 - (100 * percentage); 
      
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }
      
      
      
      
      
      //Return color for county maps
      function getColorScale(dataValue, minValue, maxValue) {
        return dataValue === null ? '#D6D6DA' : generateColor(dataValue, minValue, maxValue);
      }

      //Color shading for state maps
      function getColorScaleState(dataValue) {
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




//Create the legend
function Legend({ data }) {

  //Get min and max values for the legend colors to change dynamically
  const minValue = Math.min(...data.map((d) => d.dataValue));
  const maxValue = Math.max(...data.map((d) => d.dataValue));

  //Number of colors to show up in legend
  const numIntervals = 5;
  const intervalSize = (maxValue - minValue) / numIntervals;

  const legendComponents = Array.from({ length: numIntervals }, (_, index) => {
    const startInterval = minValue + index * intervalSize;
    const endInterval = startInterval + intervalSize;
    const legendColor = getColorScale(startInterval, minValue, maxValue);

    return {
      index,
      startInterval,
      endInterval,
      legendColor,
    };
  });

  
  const legendColors = legendComponents.map(item => item.legendColor);

  const legendItems = legendComponents.map(({ index, startInterval, endInterval }, i) => (
    <div key={index} className="legend-item">
      <div className="legend-color" style={{ backgroundColor: legendColors[i] }}></div>
      <span>
        {endInterval !== undefined
          ? `${startInterval.toFixed(2)}+`
          : `${startInterval.toFixed(2)}-${endInterval.toFixed(2)}`}
      </span>
    </div>
  ));

  return (
    <div className="legend-container">
      {legendItems}
    </div>
  );
}

//Creating United State Map with just states
if(props.mapType === "states")
      return (
        <>
        <div className='mapView-states'>
            <ComposableMap 
              data-tip=""
             projection="geoAlbersUsa" 
             projectionConfig=
             {{ 
                scale: 1000,
              }}
              >
                <Geographies geography={props.geoUrl}>
                    {({ geographies }) =>
                     geographies.map((geo) => {
                        
                      //getting data from EPH API to match with the geoUrl's location
                        const stateData = props.data.find((d) => d.geo === geo.properties.name);
                        const fillColor = stateData ? getColorScaleState(stateData.dataValue) : '#D6D6DA';

                    //if there is data, display the map of the United States
                    if(stateData != undefined) {
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}

                                //tooltip for hovering 
                                data-tip={`${geo.properties.name}: ${stateData && stateData.displayValue} ${props.units}`}
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
                        } else {
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    data-tip={geo.properties.name}
                                    style={{
                                        stroke: "#000",
                                    }}
                                    onMouseEnter={() => {
                                        ReactTooltip.rebuild();
                                    }}
                                    />

                            )
                        }
                     })   
                }
                </Geographies>
            </ComposableMap>
            <ReactTooltip />
        </div>
        </>
      )

//Creating the county maps (for each state)
    else {
        return (
            <>
            <div className="mapView-individual">
                <ComposableMap
                    data-tip=""
                    projection="geoMercator"
                    projectionConfig={{
                        rotate: [0, 0, 0],
                        center: [props.lon, props.lat],
                        scale: props.scale,
                    }}
                    >

                        <Geographies geography={props.geoUrl}>
                            {({ geographies }) => 
                                geographies.map((geo) => {

                                  //getting data from EPH API to match with the geoUrl's location
                                    const countyData = props.data.find((d) =>  d.geoId === geo.properties.GEOID);
                                    const fillColor = countyData ? getColorScale(countyData.dataValue, minValue, maxValue) : '#D6D6DA';
                                    
                                    //if there is data, display the map of the state with counties
                                    if (countyData != undefined) {
                                        return (
                                            <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            //tooltip for hovering
                                            data-tip={`${geo.properties.NAME} ${countyData && countyData.dataValue !== null ? Number(countyData.dataValue).toFixed(2) : "No Data"} ${props.units}`}
                                            style={{
                                              default: { fill: fillColor, stroke: '#000', strokeWidth: 1, outline: "none" },
                                              hover: { fill: fillColor, cursor: 'pointer', stroke: '#000', strokeWidth: 2, outline: "none" },
                                              pressed: { outline: "none" }
                                            }}
                                            onMouseEnter={() => {
                                                ReactTooltip.rebuild();

                                            }}

                                            />

                                            
                                        )
  
                                        
                                    } else {
                                        return (
                                          
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                data-tip={geo.properties.NAME}
                                                style={{
                                                  default: { fill: fillColor, stroke: '#000', strokeWidth: 1, outline: "none" },
                                                  hover: { fill: fillColor, cursor: 'pointer', stroke: '#000', strokeWidth: 2, outline: "none" },
                                                  pressed: { outline: "none" }
                                                }}
                                                onMouseEnter={() => {
                                                    ReactTooltip.rebuild();
                                                }}

                                                />
                                        )
                                    }

                                })
                            }
                        </Geographies>
                    </ComposableMap>
                    <ReactTooltip />

{/* Show the legend */}
<div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#D6D6DA' }}></div>
            <span>No Data Available</span>
          </div>
          <Legend data={props.data} />
        </div>
      </div>
            </>
        );
    }  

};

export default EPHMap;
