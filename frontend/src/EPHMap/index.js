import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from 'react-simple-maps'
import ReactTooltip from 'react-tooltip';

const EPHMap = (props) => {
    const [position, setPosition] = useState({coordinates: [-96, 38], zoom: 1});

    function textColorScale(color) {
        var r = parseInt(color.toString().substr(1, 2), 16);
        var g = parseInt(color.toString().substr(3, 2), 16);
        var b = parseInt(color.toString().substr(5, 2), 16);
    
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "black" : "white";
      }
    

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

      function handleMoveEnd(position) {
        setPosition(position);
      }
      function colorScale(val, releaseType, mapType) {
        //color scales for each release type (on-site and total have the same color scale)
        const scaleAll = [
          "#FCDBC6",
          "#FBCBCA",
          "#F2A598",
          "#F65858",
          "#E00E0E",
          "#A60A0A",
        ];
        const scaleAir = [
          "#DEDEDE",
          "#DDDDDD",
          "#AEAEAE",
          "#8D8D8D",
          "#6D6D6D",
          "#353535",
        ];
        const scaleWater = [
          "#C5E0B4",
          "#97C14B",
          "#80B145",
          "#59954A",
          "#447741",
          "#316033",
        ];
        const scaleLand = [
          "#F8CBAD",
          "#C48647",
          "#A3672B",
          "#844B11",
          "#733A00",
          "#502F0C",
        ];
        const scaleOffsite = [
          "#FFFFCA",
          "#FFF9AE",
          "#F8ED62",
          "#E9D700",
          "#DAB600",
          "#A98600",
        ];
    
        //numerical values to adjust the bucket size, values in each bucket are LESS THAN the numerical value
        const stateBuckets = [1000000, 10000000, 25000000, 50000000, 100000000];
        const countyBuckets = [1000, 10000, 100000, 1000000, 5000000];
    
        var valIndex = 0;
    
        //states and counties use a different scale to keep results presentable
        switch (mapType) {
          case "states":
            if (val < stateBuckets[0]) valIndex = 0;
            else if (val < stateBuckets[1]) valIndex = 1;
            else if (val < stateBuckets[2]) valIndex = 2;
            else if (val < stateBuckets[3]) valIndex = 3;
            else if (val < stateBuckets[4]) valIndex = 4;
            else valIndex = 5;
            break;
          default:
            if (val < countyBuckets[0]) valIndex = 0;
            else if (val < countyBuckets[1]) valIndex = 1;
            else if (val < countyBuckets[2]) valIndex = 2;
            else if (val < countyBuckets[3]) valIndex = 3;
            else if (val < countyBuckets[4]) valIndex = 4;
            else valIndex = 5;
            break;
        }
    
        //return the color for the visual element
        switch (releaseType) {
          case "air":
            return [scaleAir[valIndex]];
          case "water":
            return [scaleWater[valIndex]];
          case "land":
            return [scaleLand[valIndex]];
          case "off_site":
            return [scaleOffsite[valIndex]];
          default:
            return [scaleAll[valIndex]];
        }
      }

   /* 
    const [selectedYear, setSelectedYear] = useState([]);
    const apiURL = getApiURL(measure);

    useEffect(() => {
        axios.get(apiURL)
        .then((response) => {
            setData(response.data.tableResult);
        })
        .catch((error) => {
            console.error("error: ", error);
        })
    }, [apiURL]);

    const getApiURL = (selectedMeasure, year) => {
        setSelectedYear(year);
        switch(selectedMeasure) {
            case "asthma in children": 
                return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/3/all/all/1/${year}/0/0?AgeBandId=1,2,3,4`;
            case "childhood cancer: brain & central":
                return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/67/4/all/all/1/${year}/0/0?GenderId=1,2`;
            case "childhood cancer: leukemia":
                return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/71/4/all/all/1/${year}/0/0?GenderId=1,2`        
        }
    }

    useEffect(() => {
        if (selectedYear) {
          getApiURL(measure, selectedYear);
        }
      }, [selectedYear]);
      */


if(props.mapType === "states")
      return (
        <>
        <div className='mapView'>
            <ComposableMap data-tip="" projection="geoAlbers">
                <Geographies geography={props.geoURL}>
                    {({ geographies }) =>
                     geographies.map((geo) => {
                        
                        const stateData = props.data.find((d) => d.parentGeo === geo.properties.NAME);
                        const fillColor = stateData ? getColorScale(stateData.dataValue) : '#D6D6DA';
                    
                    if(stateData != undefined) {
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
                        } else {
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    data-tip={geo.properties.NAME}
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
        <div className='mapView'>
            <ComposableMap data-tip="" projection="geoAlbers">
                <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
                    <Geographies geography={props.geoURL}>
                        {({ geographies }) => 
                            geographies.map((geo) => {
                                const countyData = props.data.find((d) =>  d.geo === geo.properties.NAME);
                                const fillColor = countyData ? getColorScale(countyData.dataValue) : '#D6D6DA';

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
            <div className="mapView">
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
                                    const countyData = props.data.find((d) =>  d.geo === geo.properties.NAME);
                                    const fillColor = countyData ? getColorScale(countyData.dataValue) : '#D6D6DA';
                                    if (countyData != undefined) {
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
                                    } else {
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                data-tip={geo.properties.NAME}
                                                style={{default: { fill: fillColor, stroke: '#000', strokeWidth: 1, outline: "none" }}}
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
        );
    }  

};

export default EPHMap;
