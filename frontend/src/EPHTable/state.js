import "./state.css"
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import { getStateID } from '../EPHFilters/stateID';
const {getLocationParents, getYearString} = require("../helpers");


function StateTable({ measureID}) {
 
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

  //get years available for selected measure to pass to api endpoint
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


  //pass api url to get measure data
  const [data, setData] = useState([]);
  const url = `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/${measureID}/1/1/${stateID}/1/${yearString}/0/0`;
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const APIdata = response.data.tableResult.map((item) => ({
          dataValue: item.dataValue,
          sampleSize: item.sampleSize,
          concentration: item.Concentration,
          year: item.year
        })); 
        setData(APIdata);
      })
      .catch((error) => {
        console.error("Error trying to retrieve data from EPH API: ", error);
      });
  }, [url]);

  return (
    <table className="eph-table">
      <thead>
        <tr> 
          
          <th className="sticky-header">Year</th>
          <th className="sticky-header">Concentration</th>
          <th className="sticky-header">Sample Size</th>
          
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


export default StateTable;
