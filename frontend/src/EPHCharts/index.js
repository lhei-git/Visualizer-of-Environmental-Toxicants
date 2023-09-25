import React from 'react'

function EPHChart() {
    return (
      <div>
        {/* Your iframe code goes here */}
        <iframe
          src="https://ephtracking.cdc.gov/DataExplorer/?query=e2b1e9e8-d4fb-41a4-b558-aa9be5a9a69b&G1=2"
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