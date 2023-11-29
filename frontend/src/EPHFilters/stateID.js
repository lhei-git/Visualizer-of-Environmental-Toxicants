//written by Katherine O'Donnell
//function to get the state ID for the state searched by the usr to pass to the api endpoint

import axios from 'axios';
export const getStateID = (stateName, apiEndpoint) => {
    try {
      return axios.get(apiEndpoint)
        .then(response => {
          const stateData = response.data.find(item => item.parentName === stateName);
  
          if (stateData) {
            console.log('fetched state ID ' + stateData.id + ' for ' + stateName);
            return String(stateData.id);
          } else {
            throw new Error(`State ID not found for ${stateName}`);
          }
        })
        .catch(error => {
          console.error('Error fetching state ID:', error);
          throw new Error('Error fetching state ID');
        });
    } catch (error) {
      console.error('Error in getStateID:', error);
      throw new Error('Error in getStateID');
    }
  };
  
