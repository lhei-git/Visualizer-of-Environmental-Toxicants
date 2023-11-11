import "./national.css";
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
const { getLocationParents } = require("../helpers");

var stateIDs = {
    Michigan: "26",
  //!!!add other IDs or get from json
  }
  
function StateTable({ measureID}) {
  const [data, setData] = useState([]);

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

    //get state ID from location string stored in session
    const stateID = String(stateIDs[getLocationParents(state.map, "stateLong")]);


  //get API URL based on measure
  function getApiURL(id){
    if (id == 587){
        //child asthma
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/1/1/${stateID}/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011/0/0`;
    }
    else if (id == 67){
        //brain and central nervous system cancer among children
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/67/1/1/${stateID}/1/2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001/0/0`;
    }
    else if (id == 71){
        //leukemia among children
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/71/1/1/${stateID}/1/2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001/0/0`;
    }
    else {/*error handling*/}
  }

  const url = getApiURL(measureID);
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
