import React from 'react'
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
import "./index.css";

//written by Katherine O'Donnell

/* NOTES: */
/*


- asthma among children
  - measureID 587
  - displayValue: "Data Not Collected", when dataValue: null
  - 2011-2020
  - endpoint w/ no filters: https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/1/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011/0/0
  - possible filters:
    - age group: 0-4, 5-9, 10-14, 15-17
    - gender
    - race/ethnicity: White not incl Hispanic, Black not incl Hispanic, Other not incl Hispanic, Multi Race not incl Hispanic, Hispanic

- incidence of brain and central nervous system cancer among children
  - measureID 67
  - displayValue: "Suppressed" when dataValue: null
    - some states not hoverable? nebraska not hoverable but returns valid data
  - 2001 - 2019
  - endpoint w/ no filters: https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/67/1/all/all/1/2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001/0/0
  - possible filters:
    - gender
    - race/ethnicity: Asian/Pacific Islander (includes Hispanic), Black (includes Hispanic), Hispanic (all races), American Indian/Alaskan Native (includes Hispanic), White (includes Hispanic)



- incidence of leukemia among children
  - measureID 71
  - displayValue: "Suppressed" when dataValue: null
  - 2001 - 2019
  - endpoint w/ no filters: https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/71/1/all/all/1/2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001/0/0
   - possible filters:
    - gender
    - race/ethnicity: Asian/Pacific Islander (includes Hispanic), Black (includes Hispanic), Hispanic (all races), American Indian/Alaskan Native (includes Hispanic), White (includes Hispanic)
 
*/

const StateTimeSeries = ({size, measure, measureID, units, percentile, demographic, stateID}) => {
    const [data, setData] = useState([]);
    const apiURL = '';
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
  
    StateTimeSeries.propTypes = {
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
      stateID: PropTypes.number.isRequired,           //searched state id to pass to api endpoint 
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
  
  export default StateTimeSeries;