import React from 'react'
import PropTypes from 'prop-types';
import { useEffect, useState, useReducer } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';
import "./index.css";
import { getStateID } from '../EPHFilters/stateID';
import { getCountyID } from '../EPHFilters/countyID';
const {getLocationParents, getYearString} = require("../helpers");


//written by Katherine O'Donnell



const CountyTimeSeries = ({size, measureID, units, percentile, demographic}) => {
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
  const [countyID, setCountyID] = useState('');
  useEffect(() => {
    const fetchCountyID = async () => {
      try {
        const id = await getCountyID(getLocationParents(state.map, 'stateLong'), getLocationParents(state.map, 'county'), `https://ephtracking.cdc.gov/apigateway/api/v1/geographicItems/${measureID}/2/0`);
        setCountyID(id);
      } catch (error) {
        console.error('Error fetching county ID:', error);
      }
    };
    fetchCountyID();
  }, [measureID, state.map]);

  //get years available for selected measure to paass to api endpoint
  const [years, setYears] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ephtracking.cdc.gov/apigateway/api/v1/temporalItems/${measureID}/2/all/all`);
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
  const apiURL = `https:ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/${measureID}/2/2/${countyID}/1/${yearString}/0/0`;
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
  }, [apiURL, measureID]);

  

  return (
    <div className="TimeSeries" style={{width: size.width, height: size.height }}>  
      <p>{countyID}</p>
      <TimeSeries data={data} size={size} units={units}/>
    </div>
  );
}
  
CountyTimeSeries.propTypes = {
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

export default CountyTimeSeries;