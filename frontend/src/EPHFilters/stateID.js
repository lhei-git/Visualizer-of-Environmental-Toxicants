//written by Katherine O'Donnell
//function to get the state ID for the state searched by the user to pass to the API endpoint

import axios from 'axios';

export const getStateID = async (stateName, apiEndpoint) => {
    try {
        const { data } = await axios.get(apiEndpoint);
        const stateData = data.find((item) => item.parentName === stateName);

        if (stateData !== undefined) {
            console.log("State ID HERE!", stateData.id);
            return String(stateData.id);
        } else {
            throw new Error('State data not found for the given state name.');
        }
    } catch (error) {
        console.error('Error fetching state ID:', error);
        throw new Error('Error fetching state ID');
    }
};
