//import { useEffect, useState, useReducer } from "react"; //added to simplify getLocationParents

const chemicalMap = {
  "certain glycol ethers": "Glycol",
  "polycyclic aromatic compounds": "Polycyclic Aromatic Compounds",
};

// cleans up string format and removes unsearchable words
module.exports.formatChemical = (entry) => {
  if (chemicalMap[entry.toLowerCase()]) return chemicalMap[entry.toLowerCase()];

  let trimmed = entry.toLowerCase().replace(/ *\([^)]*\) */g, "");
  const i = trimmed.search(/\band|compounds\b/);
  if (i !== -1) trimmed = trimmed.slice(0, i);
  trimmed = trimmed
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/"/gi, "")
    .trim();
  return trimmed;
};

// compares two objects for shallow equality
module.exports.shallowEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

// Turns long-form decimal number into formatted string for map labels
module.exports.amountAsLabel = (value) => {
  var suffixes = ["", "K", "M", "B", "T"];
  var suffixNum = Math.floor(("" + value).length / 4);

  // convert 0.1M to 100K
  if (("" + value).length % 4 === 3) {
    suffixNum++;
  }
  // if (suffixNum % 3 === 0) suffixNum--;
  var shortValue = parseFloat(
    (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  );
  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
};

// Turns decimal number into formatted string by adding commas
module.exports.formatAmount = (value) => {
  if (value == null) return 0;
  return (+value.toFixed(2))
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

// Turns map components into readable string
module.exports.getLocationString = (map, long) => {
  let str = map.city
    ? map.city + ", "
    : map.county
    ? map.county + " County, "
    : "";
  str += long ? map.stateLong : map.state;
  return str;
};

//written by Katherine O'Donnell
//convert list of available years for a given measure to a string to pass to API endpoint
module.exports.getYearString = (yearData) => {
  //check that yearData is an array
  if (!Array.isArray(yearData)) {
    throw new Error('Input must be an array of years.');
  }
  //reverse array to get years in descending order - correct format to pass to endpoint
  //const reversedYears = yearData.reverse();
  //join years with commas - correct format to pass to endpoint
  const yearString = yearData.join(',');
  return yearString;
};

//written by Katherine O'Donnell
//gets 'parents' of location searched
module.exports.getLocationParents = (map, parentType) => {
  //returns state abbreviation
  if (parentType === "state"){ return map.state; }
  //returns full state name
  else if (parentType === "stateLong"){ return map.stateLong; }
  //returns county name
  else if (parentType === "county"){ return map.county; } //POSSIBLY: map.county + " County"
}

/*
add the code below to a function to use helper functions w/ "state.map":

import { useEffect, useState, useReducer } from "react";
const { getLocationParents, (etc) } = require("../helpers");

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

*/