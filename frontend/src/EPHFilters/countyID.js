//written by Katherine O'Donnell
//function to get the county ID for the state searched by the usr to pass to the api endpoint

import axios from 'axios';

export const getCountyID = async (stateName, countyName, apiEndpoint) => {
    console.log("fetching county id for " + countyName + " County using endpoint " + apiEndpoint + " ...")
    try {
    const response = await axios.get(apiEndpoint);
    const countyData = response.data.find(item => (item.parentName === stateName) && (item.childName === countyName));
    
    if (countyName == null){
        throw new Error(`Null county name for location searched`);
    } else if (countyData) {
        return String(countyData.id);
    } else {
        throw new Error(`County ID not found for ${countyName}`);
    }
    } catch (error) {
        console.error('Error fetching county ID:', error);
        if (countyName == null){
            throw new Error('Null county name for location searched');
        } else {
            throw new Error('Error fetching county ID');
        }
    }
};

