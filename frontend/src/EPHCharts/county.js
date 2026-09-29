import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';


import axios from 'axios';
import { getCountyID } from '../EPHFilters/countyID';
import { getLocationParents, getYearString } from '../helpers';
import LoadingSpinner from '../LoadingSpinner';
import TimeSeries from './timeseries';

/*farzana -- created the class*/
class CountyTimeSeries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: JSON.parse(sessionStorage.getItem('map')),
      filters: {
        chemical: 'all',
        pbt: false,
        carcinogen: false,
        releaseType: 'all',
        year: 2021,
      },
      errorMessage: '', 
      years: [],
      data: null,
    };
  }

  /*Katie fetched code from API*/
  async fetchDataFromAPI() {
    try {
      const id = await getCountyID(
        getLocationParents(this.state.map, 'stateLong'), getLocationParents(this.state.map, 'county'),
        `https://ephtracking.cdc.gov/apigateway/api/v1/geographicItems/${this.props.measureID}/2/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744` //farzana added in apiToken
      );
      this.setState({ countyID: id });
  
      const yearResponse = await axios.get(
        `https://ephtracking.cdc.gov/apigateway/api/v1/temporalItems/${this.props.measureID}/2/all/all?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`//farzana added in apiToken
      );
      const yearData = yearResponse.data.map((item) => item.temporalId);
      this.setState({ years: yearData });
  
      const yearString = getYearString(yearData);
      
      const apiURL = `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/${this.props.measureID}/2/2/${id}/1/${yearString}/0/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`; //farzana added in apiToken
  
      const apiResponse = await axios.get(apiURL);
      console.log('API RESPONSE: ', apiResponse);
      
      
      const responseData = apiResponse.data.tableResult.map((item) => ({
        year: item.temporal,
        dataValue: item.dataValue,
        state: item.geo, 
      }));
    
      // Update state and set loading to false
      this.setState((prevState) => ({
        ...prevState,
        countyID: id,
        years: yearData,
        data: responseData,
        errorMessage: '',
      }));

      console.log("Measure data: " + responseData)
  
      // Store data in session storage with a dynamic key based on measureID
      //sessionStorage.setItem(`ephData_${this.props.measureID}`, JSON.stringify(responseData));
    } catch (error) {
      if (error.response) {
        // The request was made, but the server responded with a status code outside the range of 2xx
        console.error('HTTP error response status code:', error.response.status);
        console.error('HTTP error response data:', error.response.data);
      } else if (error.request) {
        // The request was made, but no response was received
        console.error('No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error during API call:', error.message);
      }
    
      // Log the full error object
      console.log('Full error object:', error);

      var newErrorMessage = "Error retrieving data from EPH API";
      //add a different error message if there is no county data
      if (error == 'Error: Error fetching county ID'){
        console.log("setting new error message!");
        newErrorMessage = "No data available for selected health issue in " + getLocationParents(this.state.map, 'county') + " County";
      } else if (error == 'Error: Null county name for location searched'){
        console.log("setting new error message!");
        newErrorMessage = "Search a smaller location (address, city, or county) to view data on a specific county";
      }

      this.setState((prevState) => ({
        ...prevState,
        errorMessage: newErrorMessage,
      }));
    }}

  componentDidUpdate(prevProps) {
    if (this.props.measureID !== prevProps.measureID) {
      this.fetchDataFromAPI();
    }
  }

  componentDidMount() {
      this.fetchDataFromAPI();
  }
  

  componentWillUnmount() {
    this.setState({ data: [] });
  }

  render() {
    // Rendering component using this.state and this.props
  
    const { errorMessage, loading } = this.state;

    if (errorMessage) {
      return <div className="timeseries-error-message"><span className="error-icon">&#9888; </span>{errorMessage}</div>;
    }

    return (
      <div>
          <div className="TimeSeries" >
            {/*loading spinner shows if data has not loaded*/}
          {this.state.data ? (
            <TimeSeries data={this.state.data} size ={{width:this.props.size.width, height:this.props.size.height }} units={this.props.units}/>
            ) : (
                <LoadSpinner />
            )}
          </div>

      </div>
    );
  }
}

CountyTimeSeries.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  measureID: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
  percentile: PropTypes.number.isRequired,
  demographic: PropTypes.number.isRequired,

};

function LoadSpinner() {
  return (
    <div
      style={{
        width: '100%',
        height: '100',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoadingSpinner></LoadingSpinner>
    </div>
  );
}

export default CountyTimeSeries;
