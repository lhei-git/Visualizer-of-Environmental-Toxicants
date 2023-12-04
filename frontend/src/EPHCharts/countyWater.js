//created by katie
//handles different json file for drinking water measures
import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { getCountyID } from '../EPHFilters/countyID';
import { getLocationParents, getYearString } from '../helpers';
import LoadingSpinner from '../LoadingSpinner';
import TimeSeries from './timeseries';

/*farzana -- created the class*/
class CountyTimeSeriesWater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: JSON.parse(sessionStorage.getItem('map')),
      filters: {
        chemical: 'all',
        pbt: false,
        carcinogen: false,
        releaseType: 'all',
        year: 2022,
      },
      errorMessage: '', 
      years: [],
      data: [],
    };
  }

  /*Katie - fetch and store code from API*/
  async fetchDataFromAPI() {
    console.log("fetching watwr data from the api")
    try {
    //use helper function to get ID of county from api based on name of county searched by user
      const id = await getCountyID(
        getLocationParents(this.state.map, 'stateLong'), getLocationParents(this.state.map, 'county'),
        `https://ephtracking.cdc.gov/apigateway/api/v1/geographicItems/${this.props.measureID}/2/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744` //farzana added in apiToken
      );
      this.setState({ countyID: id });

      const yearResponse = await axios.get(
        `https://ephtracking.cdc.gov/apigateway/api/v1/temporalItems/${this.props.measureID}/2/all/all?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`//farzana added in apiToken
      );
      const yearData = yearResponse.data.map((item) => item.temporal);  
      //use helper function to get string of years to pass to endpoint from yearString object
      const yearString = getYearString(yearData);
      this.setState({ years: yearData });

      //construct API endpoint for selected measure in the county searched      
      const apiURL = `https:ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/${this.props.measureID}/2/2/${id}/1/${yearString}/0/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`; //farzana added in apiToken
      console.log("api url: ", apiURL);
        const apiResponse = await axios.get(apiURL);
        console.log('API RESPONSE: ', apiResponse);
        if (apiResponse.status === 200) {
            const rawData = apiResponse.data.cwsTableResult;
          
            // Initialize an object to store the sum and count for each year
            const yearData = {};
          
            // Iterate over the rawData array
            rawData.forEach((entry) => {
              const { year, dataValue } = entry;
          
              if (year in yearData) {
                // If the year is already in yearData, update the sum and count
                yearData[year].sum += parseFloat(dataValue) ;
                yearData[year].count += 1;
              } else {
                // If the year is not in yearData, initialize it
                yearData[year] = { sum: parseFloat(dataValue) , count: 1 };
              }
            });
          
            // Calculate the average for each year
            const averagedData = Object.entries(yearData).map(([year, values]) => {
              const averageValue = values.sum / values.count;
              return { year, dataValue: isNaN(averageValue) ? null : averageValue };
            });
          
            console.log('Averaged Data:', averagedData);


        this.setState({ data: averagedData });
        } else {
        console.error("Unexpected error. Status code:", apiResponse.status);
        }

        /*
        const responseData = apiResponse.data.tableResult.map((item) => ({
        year: item.year,
        dataValue: item.dataValue,
        state: item.geo, 
      }));
        */
        // Update state and set loading to false
        this.setState((prevState) => ({
        ...prevState,
        stateID: id,
        years: yearData,
        //data: rawData,
        errorMessage: '',
        }));
    
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
      if (error == "Error: Error fetching county ID"){
        newErrorMessage = "No data available for selected health issue in " + getLocationParents(this.state.map, 'county') + " County";
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

    if (loading) {
      /*load spinner from previous group*/
      return <LoadSpinner />;
    }

    return (
      <div>
       {/* {this.props.stateData ? ( */}
          <div className="TimeSeries" >
 
            <TimeSeries data={this.state.data} size ={{width:this.props.size.width, height:this.props.size.height }} units={this.props.units}/>

          </div>

      </div>
    );
  }
}

CountyTimeSeriesWater.propTypes = {
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

export default CountyTimeSeriesWater;
