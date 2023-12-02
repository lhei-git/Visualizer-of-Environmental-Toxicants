//==========================================
// Author: Farzana Israt
//==========================================
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

      function generateColor(value, minValue, maxValue) {
        const percentage = (value - minValue) / (maxValue - minValue);
        const hue = 200; // Blue hue
        const saturation = 80; 
        const lightness = 30 + 20 * percentage; // Vary lightness from 30% to 80%
      
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }
      
      
      
      
      function getColorScale(dataValue, minValue, maxValue) {
        return dataValue === null ? '#D6D6DA' : generateColor(dataValue, minValue, maxValue);
      }

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





function Legend({ data }) {
  if (data.length === 0) {
    // No data available, hide the legend
    return null;
  }

  const minValue = Math.min(...data.map((d) => d.dataValue));
  const maxValue = Math.max(...data.map((d) => d.dataValue));

  const numIntervals = 5;
  const intervalSize = (maxValue - minValue) / numIntervals;

  const legendItems = Array.from({ length: numIntervals }, (_, index) => {
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

  // Extract legend colors and reverse the array
  const legendColors = legendItems.map(item => item.legendColor);
  legendColors.reverse();

  const reversedLegendItems = legendItems.map(({ index, startInterval, endInterval }, i) => (
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
      {reversedLegendItems}
    </div>
  );
}


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
                        
                        const stateData = props.data.find((d) => d.geo === geo.properties.name);
                        const fillColor = stateData ? getColorScaleState(stateData.dataValue) : '#D6D6DA';
                    
                    if(stateData != undefined) {
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
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

else if(props.mapType === "counties")
    return (
        <>
        <div className='mapView-counties'>
            <ComposableMap data-tip="" projection="geoAlbers">
                <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
                    <Geographies geography={props.geoURL}>
                        {({ geographies }) => 
                            geographies.map((geo) => {
                                const countyData = props.data.find((d) =>  d.geo === geo.properties.NAME);
                                const fillColor = countyData ? getColorScale(countyData.dataValue, minValue, maxValue) : '#D6D6DA';

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
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
            <ReactTooltip />
        </div>
        </>

        )

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
                                    const countyData = props.data.find((d) =>  d.geoId === geo.properties.GEOID);
                                    const fillColor = countyData ? getColorScale(countyData.dataValue, minValue, maxValue) : '#D6D6DA';
                                    
                                    if (countyData != undefined) {
                                        return (
                                            <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            
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
