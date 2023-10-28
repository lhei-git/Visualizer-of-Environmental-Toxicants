import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from 'react-simple-maps'
import ReactTooltip from 'react-tooltip';

const EPHReusableMap = ({props}) => {
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


if(props?.mapType === "states")
      return (
        <>
        <div className='mapView'>
            <ComposableMap data-tip="" projection="geoAlbers">
                <Geographies geography={props?.geoURL}>
                    {({ geographies }) =>
                     geographies.map((geo) => {
                        const stateData = props?.data.find((d) => d.geo === geo.properties.name);
                        const fillColor = stateData ? getColorScale(stateData.dataValue) : '#D6D6DA';
                    
                    if( stateData != undefined) {
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                data-tip={geo.properties.name}
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

else if(props?.mapType === "county")
    return (
        <>
        <div className='mapView'>
            <ComposableMap data-tip="" projection="geoAlbers">
                {/*<ZoomableGroup center={}>*/}
                    <Geographies geography={props?.geoURL}>
                        {({ geographies }) => 
                            geographies.map((geo) => {
                                const countyData = props?.data.find((d) =>  d.geo === geo.properties.name);
                                const fillColor = countyData ? getColorScale(countyData.dataValue) : '#D6D6DA';

                                return (
                                    <Geography
                                      key={geo.rsmKey}
                                      geography={geo}
                                      data-tip={geo.properties.name}
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
                {/*</ZoomableGroup>*/}
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
                    //projection="geoMercator"
                    projectionConfig={{
                        rotate: [0, 0, 0],
                        center: [props?.lon, props?.lat],
                        scale: props?.scale,
                    }}
                    >
                        <Geographies geography={props?.geoURL}>
                            {({ geographies }) => 
                                geographies.map((geo) => {
                                    const countyData = props?.data.find((d) =>  d.geo === geo.properties.name);
                                    const fillColor = countyData ? getColorScale(countyData.dataValue) : '#D6D6DA';
                                    if (countyData != undefined) {
                                        return (
                                            <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            data-tip={geo.properties.name}
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
            </div>
            </>
        );
    }    

};

export default EPHReusableMap;
