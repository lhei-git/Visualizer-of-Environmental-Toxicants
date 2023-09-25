import React from 'react'

function EPHChart() {
    return (
      <div className='eph-chart-container'>
        {/* Your iframe code goes here */}
        <iframe
          src="https://ephtracking.cdc.gov/DataExplorer/?query=96874ebc-6ddf-4804-bf5b-0a1752576cba&G1=2" 
          width="600"
          height="450"
          title="CDC Tracking Network Chart"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  
export default EPHChart;