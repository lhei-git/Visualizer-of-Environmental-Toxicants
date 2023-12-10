//==========================================
// Author: Farzana Israt
//==========================================
//Some of this code mimics the previous team's code in ThematicMapView

//Creating national map for state-level data
import React, { Component } from 'react';
import axios from 'axios';
import EPHMap from '../EPHMap/index';
import LoadingSpinner from '../LoadingSpinner';
import "./index.css"
import FadeInSection from '../FadeInSection';

//geoUrl for creating the map of the whole United States
const stateGeoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';


//Creating the class
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
  
//When the component mounts, get the data from the EPH API
  componentDidMount() {
    this.getStateData();
  }


  componentDidUpdate(prevProps, prevState) {
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

  //Get URL for each measure 
  getApiURL() {
    //Filter by year
    const selectedYear = this.state.selectedYear;
    //Filter by gender
    const selectedGender = this.state.gender;

    if (this.props.measure === "Asthma in Children") {
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/4/all/all/1/${selectedYear}/0/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`;
    } else if (this.props.measure === "Childhood Brain and Nervous System Cancer") {
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/67/4/all/all/1/${selectedYear}/0/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`;
    } else if (this.props.measure === "Childhood Cancer Leukemia") {
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/71/4/all/all/1/${selectedYear}/0/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`;
    }
}

//Get the data from the API and store it in stateData
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

  //Get units for each measure for the tooltip on the map
  getUnits(endUnits) {
    if (this.props.measure === "Asthma in Children") {
      return endUnits = "(Percent)"
    }
    else if (this.props.measure === "Childhood Brain and Nervous System Cancer") {
      return endUnits = "(Counts)"
    }
    else if (this.props.measure === "Childhood Cancer Leukemia") {
      return endUnits = "(Counts)"
    }
  }

  //Get subtitle for each measure
  getSubtitle(subtitle) {
    if(this.props.measure === "Asthma in Children") {
      return subtitle = "Crude Prevalence of Children <=17 Years of Age Ever Diagnosed with Asthma"
    }
    else if (this.props.measure === "Childhood Brain and Nervous System Cancer") {
      return subtitle = "Annual Number of Cases of Brain and Central Nervous System Cancer among Children <20 Years of Age"
    }
    else if (this.props.measure === "Childhood Cancer Leukemia") {
      return subtitle = "Annual Number of Leukemia among Children <20 Years of Age"
    }
  }
  

  //When gender input from user changes
  handleGenderChange = (event) => {
    this.setState({ gender: event.target.value }, () => {
      this.getStateData(); 
    });
  };

  //When year input from user changes
  handleYearChange = (event) => {
    this.setState({ selectedYear: event.target.value }, () => {
      this.getStateData(); 
    });
  };

  //Render the map
  render() {
    const selectedYear = this.state.selectedYear;
    const yearOptions = this.props.yearRange;

    return (
      <div className='nation-mapView'>
        <div className='container'>
          <FadeInSection>
          <FadeInSection>
          <h1>{this.props.measure} in the U.S.</h1>
          <h3>{this.getSubtitle()}</h3>
          </FadeInSection>
        <div className='centered-dropdown'>
        
          {/* Year dropdown */}
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


        {/* Gender dropdown */}
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
        
        {/* If data loads, create the map. If not, loading symbol */}
        <FadeInSection>
        {this.state.stateData ? (
            
        <EPHMap
            
            geoUrl={stateGeoUrl}
            data={this.state.stateData}
            mapType={"states"}
            units={this.getUnits()}
           />
           
           
        ) : (
            <LoadSpinner />
        )}
        </FadeInSection>
        </FadeInSection>
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
