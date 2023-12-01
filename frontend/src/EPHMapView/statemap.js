//==========================================
// Author: Farzana Israt
//==========================================

import React, { Component } from 'react';
import axios from 'axios';
import EPHMap from '../EPHMap/index';
import LoadingSpinner from '../LoadingSpinner';
import ReactTooltip from 'react-tooltip';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import "./statemap.css";
const stateGeoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

class StateMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: this.props.yearRange[0],
      measure: "",
      stateData: null,
      gender: "1",
    };

    this.handleContentCountyState = this.handleContentCountyState.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }
  handleContentCountyState(content) {
    this.setState({ content: content });
  }

  componentDidMount() {
    this.getStateData();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("GeoJSON Data on Mount:", this.props.data);
    if (prevProps.measure !== this.props.measure) {
        this.setState(
        {
            stateData: null,
        },
        () => {
            this.getStateData();
        }
        )
    }
    
    
    
  }

  getApiURL() {
    const selectedYear = this.state.selectedYear;
    const selectedGender = this.state.gender;

    if (this.props.measure === "Asthma in Children") {
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/4/all/all/1/${selectedYear}/0/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`;
    } else if (this.props.measure === "Childhood Brain and Nervous System Cancer") {
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/67/4/all/all/1/${selectedYear}/0/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`;
    } else if (this.props.measure === "Childhood Cancer Leukemia") {
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/71/4/all/all/1/${selectedYear}/0/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`;
    }
}


async getStateData() {
    const apiUrl = this.getApiURL();
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        this.setState({ stateData: response.data.tableResult });
      } else {
        console.error("Unexpected error. Status code: ", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  

  handleGenderChange = (event) => {
    this.setState({ gender: event.target.value }, () => {
      this.getStateData(); 
    });
  };

  handleYearChange = (event) => {
    this.setState({ selectedYear: event.target.value }, () => {
      this.getStateData(); 
    });
  };

  render() {
    const selectedYear = this.state.selectedYear;
    const yearOptions = this.props.yearRange;

    return (
      <div className='nation-mapView'>
        <div className='container'>
          <h1>{this.props.measure} in the U.S.</h1>
        <div className='centered-dropdown'>
        <div className="dropdown-center-year">
          <label> Year: </label>
          <select
            value={selectedYear}
            onChange={this.handleYearChange}
            style={{ fontSize: '18px', marginBottom: '50px'}}
          >
            {yearOptions.map((year) => (
                <option key={year} value={year}>
                    {year}
                </option>
            ))}
          </select>
        </div>
        
          <div className="dropdown-center-gender">
            <label>Select a Gender: </label>
            <select
              value={this.state.gender}
              onChange={this.handleGenderChange}
              style={{ fontSize: '18px', marginBottom: '50px' }}
            >
              <option>Select a Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>
          </div>
        
        {this.state.stateData ? (
            
        <EPHMap
            
            geoUrl={stateGeoUrl}
            data={this.state.stateData}
            mapType={"states"}
           />
           
           
        ) : (
            <LoadSpinner />
        )}
      </div>
      </div>
    );
  }
}


function LoadSpinner() {
    return (
      <div
        style={{
          width: "100%",
          height: "100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

export default StateMap;
