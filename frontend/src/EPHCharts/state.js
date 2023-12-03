import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from 'recharts';
import axios from 'axios';
import { getStateID } from '../EPHFilters/stateID';
import { getLocationParents, getYearString } from '../helpers';
import LoadingSpinner from '../LoadingSpinner';
import TimeSeries from './timeseries';

/* Amrita - Customize to matching TRI timelines */
class CustomLine extends Line {
  static defaultProps = {
    ...Line.defaultProps,
    type: "monotone",
    strokeWidth: 3,
    dot: false,
    activeDot: { r: 8 },
  };
}

class StateTimeSeries extends Component {
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

  async fetchDataFromAPI() {
    try {
      const id = await getStateID(
        getLocationParents(this.state.map, 'stateLong'),
        `https://ephtracking.cdc.gov/apigateway/api/v1/geographicItems/${this.props.measureID}/1/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
      );
      this.setState({ stateID: id });
  
      const response = await axios.get(
        `https://ephtracking.cdc.gov/apigateway/api/v1/temporalItems/${this.props.measureID}/1/all/all?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
      );
      const yearData = response.data.map((item) => item.temporal);
      this.setState({ years: yearData });
  
      const yearString = getYearString(yearData);
      const apiURL = `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/${this.props.measureID}/1/1/${id}/1/${yearString}/0/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`;
  
      const apiResponse = await axios.get(apiURL);
      console.log('API RESPONSE: ', apiResponse);
      const responseData = apiResponse.data.tableResult.map((item) => ({
        year: item.year,
        dataValue: item.dataValue,
        state: item.geo, 
      }));
  
      // Update state and set loading to false
      this.setState((prevState) => ({
        ...prevState,
        stateID: id,
        years: yearData,
        data: responseData,
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
    
      this.setState((prevState) => ({
        ...prevState,
        errorMessage: 'Error retrieving data from EPH API',
      }));
    }}

  componentDidUpdate(prevProps) {
    if (this.props.measureID !== prevProps.measureID) {
      this.fetchDataFromAPI();
    }
  }

  componentDidMount() {
    // Check if data is already in session storage
    //const storedData = sessionStorage.getItem(`ephData_${this.props.measureID}`);
    //if (storedData) {
      //this.setState({ data: JSON.parse(storedData) });
    //} else {
      this.fetchDataFromAPI();
    //}
  }
  

  componentWillUnmount() {
    this.setState({ data: [] });
  }

  render() {
    // Your component rendering logic using this.state and this.props
  
    const { errorMessage, loading } = this.state;

    if (errorMessage) {
      return <div>Error: {errorMessage}</div>;
    }

    if (loading) {
      return <LoadSpinner />;
    }

    return (
      <div>
       {/* {this.props.stateData ? ( */}
       <div className="TimeSeries" >

       {/*
            <LineChart width={this.props.size.width} height={this.props.size.height} data={this.state.data}>
              <CartesianGrid />
              <XAxis dataKey="year" />
              <YAxis>
                <Label
                  style={{ textAnchor: 'middle' }}
                  angle={270}
                  position="insideLeft"
                  value={this.props.units}
                  margin={200}
                />
              </YAxis>
              <Tooltip />
              <CustomLine name="Percent" type="monotone" dataKey="dataValue" stroke="#9d27b0" />
            </LineChart>
        */}
         
            <TimeSeries data={this.state.data} size ={{width:this.props.size.width, height:this.props.size.height }} units={this.props.units}/>

          </div>
    
      </div>
    );
  }
}

StateTimeSeries.propTypes = {
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

export default StateTimeSeries;
