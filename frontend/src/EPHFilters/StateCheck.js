//created by Katherine O'Donnell
//purpose: to see whether or not a state has data for a particular measure

import React, { useState, useEffect } from 'react';

function StateCheck({ apiEndpoint, stateName }) {
  const [result, setResult] = useState('');

  useEffect(() => {
    // Fetch the JSON data from the API endpoint for measure selected by user
    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        const searchResult = data.find((item) => item.parentName === stateName);
        if (searchResult) {
          setResult(`parentGeographicId = ${searchResult.parentGeographicId}`);
        } else {
          setResult('Error: Parent name not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setResult('Error: Unable to fetch data');
      });
  }, [apiEndpoint, stateName]);

  return result;
}


StateCheck.propTypes = {
    apiEndpoint: PropTypes.string.isRequired, //api endpoint for measure selected by user
    stateName: PropTypes.string.isRequired //state searched by user
}

export default StateCheck;
