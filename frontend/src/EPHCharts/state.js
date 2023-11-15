import React from 'react'
import PropTypes from 'prop-types';
import { useEffect, useState, useReducer } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
import "./index.css";
import { getStateID } from '../EPHFilters/stateID';
const {getLocationParents, getYearString} = require("../helpers");


//written by Katherine O'Donnell

/* NOTES: */
/*
- asthma among children
  - measureID 587
  - measure: PREVALENCE OF ASTHMA AMONG CHILDREN | CRUDE PREVALENCE OF CHILDREN <=17 YEARS OF AGE EVER DIAGNOSED 
  - displayValue: "Data Not Collected", when dataValue: null
  - 2011-2020
  - endpoint w/ no filters: https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/1/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011/0/0
  - possible filters:
    - age group: 0-4, 5-9, 10-14, 15-17
    - gender
    - race/ethnicity: White not incl Hispanic, Black not incl Hispanic, Other not incl Hispanic, Multi Race not incl Hispanic, Hispanic

- incidence of brain and central nervous system cancer among children
  - measureID 67
  - measure: INCIDENCE OF LEUKEMIA | ANNUAL NUMBER OF LEUKEMIA AMONG CHILDREN <20 YEARS OF AGE 
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

const StateTimeSeries = ({size, measureID, units, percentile, demographic}) => {
  //below code pulls searched location from app session storage 
    // Initial state of app 
    const initialState = {
      map: JSON.parse(sessionStorage.getItem("map")),
      filters: {
      chemical: "all",
      pbt: false,
      carcinogen: false,
      releaseType: "all",
      //sets initial state to latest year/
      year: 2022,
      },
      errorMessage: "",
  };
  const reducer = (state, action) => {
      switch (action.type) {
        case "setMap":
          // Store latest searched location in session /
          sessionStorage.setItem("map", JSON.stringify(action.payload));
          return {
            ...state,
            map: action.payload,
          };
        case "setFilters":
          const newFilters = Object.assign({}, action.payload);
          return { ...state, filters: newFilters };
    
    
        case "setErrorMessage":
          return { ...state, errorMessage: action.payload };
        default:
          throw new Error();
      }
    };
  const [state] = useReducer(reducer, initialState);
  //end of storage retrieval

  //use api call geographicItems to obtain the state ID of the state searched by the user
  //helper getLocationParents returns name of the searched state from session storage
  const [stateID, setStateID] = useState('');
  useEffect(() => {
    const fetchStateID = async () => {
      try {
        const id = await getStateID(getLocationParents(state.map, 'stateLong'), `https://ephtracking.cdc.gov/apigateway/api/v1/geographicItems/${measureID}/1/0`);
        setStateID(id);
      } catch (error) {
        console.error('Error fetching state ID:', error);
      }
    };
    fetchStateID();
  }, [measureID, state.map]);

  //get years available for selected measure to paass to api endpoint
  const [years, setYears] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ephtracking.cdc.gov/apigateway/api/v1/temporalItems/${measureID}/1/all/all`);
        const yearData = response.data.map(item => item.temporal);//extract years 
        setYears(yearData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  //convert array of years to string
  const yearString = getYearString(years);

  //get measure data from API and stores it as 'data' object to be accessed by time series function
  const [data, setData] = useState([]);
  const apiURL = `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/${measureID}/1/1/${stateID}/1/${yearString}/0/0`;
  useEffect(() => {
    axios.get(apiURL)
      .then((response) => {
        const newData = response.data.tableResult.map((item) => ({
          year: item.year,
          dataValue: item.dataValue,
          //add error handling if dataValue is null?????
        }));
        setData(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [apiURL]);

  

  return (
    <div className="TimeSeries" style={{width: size.width, height: size.height }}>  
      {/*
       <h1>{getLocationParents(state.map, 'stateLong')}</h1>
      <p>state id {stateID}</p>
      <p>measure id {measureID}</p>
      */}   
      <p>state id {stateID}</p>
      <TimeSeries data={data} size={size} units={units}/>
    </div>
  );
}
  
StateTimeSeries.propTypes = {
  size: PropTypes.shape({                     //size of chart to be displayed
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  measureID: PropTypes.number.isRequired,       //measure selected on eph page
  units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
  //lineName: PropTypes.string.isRequired,      //type of measure (e.g. concentration) selected on eph page
  percentile: PropTypes.number.isRequired,         //1=50th, 2=95th
  demographic: PropTypes.number.isRequired,         //16=US pop 10=male 
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
      <Line name="Percent" type="monotone" dataKey="dataValue" stroke="purple" />
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