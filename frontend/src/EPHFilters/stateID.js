//written by Katherine O'Donnell
//function to get the state ID for the state searched by the usr to pass to the api endpoint

// getStateID.js
import axios from 'axios';

export const getStateID = async (stateName, apiEndpoint) => {
    //apiEndpoint = `https://ephtracking.cdc.gov/apigateway/api/v1/geographicItems/${measureID}/1/0`;

    try {
    const response = await axios.get(apiEndpoint);
    const stateData = response.data.find(item => item.parentName === stateName);

    if (stateData) {
        return String(stateData.id);
    } else {
        throw new Error(`State ID not found for ${stateName}`);
    }
    } catch (error) {
    console.error('Error fetching state ID:', error);
    throw new Error('Error fetching state ID');
    }
};

