import "./county.css"
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import { getStateID } from '../EPHFilters/stateID';
import { getCountyID } from "../EPHFilters/countyID";

const {getLocationParents, getYearString} = require("../helpers");

  
function CountyTable({ measureID}) {
 
  //below code pulls searched location from app session storage/
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
    //end of storage retrieval code

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

  //get years available for selected measure to pass to api endpoint
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

  //pass api url to get measure data
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
  }, [apiURL]);

  return (
    <table className="eph-table">
      <thead>
        <tr> 
          <th className="sticky-header">Year</th>
          <th className="sticky-header">Concentration</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.year}</td>
            <td>{item.dataValue}</td>
            <td>{item.sampleSize}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export default CountyTable;
