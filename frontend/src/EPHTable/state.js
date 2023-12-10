import React, { Component } from 'react';
import axios from 'axios';
import { getStateID } from '../EPHFilters/stateID';
import { getLocationParents, getYearString } from '../helpers';

class StateTable extends Component {
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
      errorMessage: null,
      stateID: '',
      years: [],
      data: [],
    };
  }

  async componentDidMount() {
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
      const APIdata = apiResponse.data.tableResult.map((item) => ({
        dataValue: item.dataValue,
        sampleSize: item.sampleSize,
        concentration: item.Concentration,
        year: item.year,
      }));

      this.setState({ data: APIdata });
    } catch (error) {
      console.error('Error fetching data:', error);
      var newErrorMessage = "Error retrieving data from EPH API";
      //add a different error message if there is no county data
      if (error == 'Error: Error fetching county ID'){
        console.log("setting new error message!");
        newErrorMessage = "No data available for selected health issue in " + getLocationParents(this.state.map, 'county') + " County";
      }
      this.setState({ errorMessage: newErrorMessage });
    }
  }

  render() {
    const { data, errorMessage } = this.state;

    return (
      <table className="eph-table">
        <thead>
          <tr>
            <th className="sticky-header">Year</th>
            <th className="sticky-header">{this.props.units}</th>
          
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.year}</td>
              <td>{item.dataValue}</td>
            
            </tr>
          ))}
          {errorMessage && (
            <tr>
              <td colSpan="3" style={{ color: 'red' }}>
                {errorMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default StateTable;
