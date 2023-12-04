//written by Katherine O'Donnell
//function to get the county ID for the state searched by the usr to pass to the api endpoint

import axios from 'axios';

export const getCountyID = async (stateName, countyName, apiEndpoint) => {
    //apiEndpoint = `https://ephtracking.cdc.gov/apigateway/api/v1/geographicItems/${measureID}/1/0`;

    console.log("fetching county id for " + countyName + " County using endpoint " + apiEndpoint + " ...")
    try {
    const response = await axios.get(apiEndpoint);
    const countyData = response.data.find(item => (item.parentName === stateName) && (item.childName === countyName));

    if (countyData) {
        return String(countyData.id);
    } else {
        throw new Error(`County ID not found for ${countyName}`);
    }
    } catch (error) {
    console.error('Error fetching county ID:', error);
    throw new Error('Error fetching county ID');
    }
};

