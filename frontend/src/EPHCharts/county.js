import React from 'react'
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
import "./index.css";

//written by Katherine O'Donnell

const CountyTimeSeries = ({size, measure, measureID, units, percentile, demographic, countyID}) => {
    const [data, setData] = useState([]);
    const apiURL = `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/${measureID}/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=25&DemographicId=${demographic}&PercentileId=${percentile}`;
    ;    //api endpoint selected based on measure
        //double check all parameters
  
    useEffect(() => {
  
      axios.get(apiURL)
        .then((response) => {
          const newData = response.data.sampleSizeTableResult.map((item) => ({
            year: item.year,
            dataValue: item.dataValue,
          }));
          setData(newData);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [apiURL]);
  
  
    return (
      <div className="TimeSeries" style={{width: size.width, height: size.height }}>
        <TimeSeries data={data} size={size} units={units}/>
      </div>
    );
  }
  
    CountyTimeSeries.propTypes = {
      size: PropTypes.shape({                     //size of chart to be displayed
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
      measure: PropTypes.string.isRequired,       //measure selected on eph page
      units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
      //lineName: PropTypes.string.isRequired,      //type of measure (e.g. concentration) selected on eph page
      percentile: PropTypes.number.isRequired,         //1=50th, 2=95th
      demographic: PropTypes.number.isRequired,         //16=US pop 10=male 
      measureID: PropTypes.number.isRequired,           //selected measure id to pass to api endpoint 
      countyID: PropTypes.number.isRequired,           //searched county id to pass to api endpoint 
    };
  
    function TimeSeries({ data, size, units }) {
      
      return (
        <LineChart width={size.width} height={size.height} data={data}>
          <CartesianGrid />
          <XAxis dataKey="year" />
          <YAxis>
            <Label 
              style={{textAnchor: "middle"}}
              angle={270} 
              position='insideLeft'
              value={units}
              margin={200}/>
          </YAxis>
          <Tooltip />
          <Line name="Concentration" type="monotone" dataKey="dataValue" stroke="purple" />
        </LineChart>
      );
    }
  
    TimeSeries.propTypes = {
      size: PropTypes.shape({                     //same size prop as chart
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
      units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
    };
  
  export default CountyTimeSeries;