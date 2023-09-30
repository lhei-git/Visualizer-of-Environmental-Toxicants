import "./index.css";
import EPHChart from "../EPHCharts/index.js"
const React = require("react");

handleMeasureChange = (event) => {
  // Update the selected option when the dropdown changes
  this.setState({ selectedOption: event.target.value });
};

function EPHData() {
  return (
    
    <div className="eph-container">
      <div className="eph-dropdown">
        <p>Please choose a measure: </p>
        <select id="category" onChange = {this.handleMeasureChange()}>
              <option value="lead">Lead in Blood</option>
              <option value="metals">Metals and Metalloids</option>
              <option value="pfos">PFOS & PFOA Surfactants in Blood</option>
        </select>
      </div>
      <div className="lead-header">
        <h1>Lead in Blood</h1>
      </div>
      <div className="chart">
        {/* Display content based on the selected option */}
        {this.state.selectedOption === 'lead' && (
        <div>
          <EPHChart/> {/*change later once chart accepts different inputs*/}
        </div>
        )}
        {this.state.selectedOption === 'metals' && (
        <div>
          metals chart {/*change later once chart accepts different inputs*/}
        </div>
        )}
        {this.state.selectedOption === 'pfos' && (
        <div>
          PFOS chart {/*change later once chart accepts different inputs*/}
        </div>
        )}
        
      </div>
    </div>
  );
}

export default EPHData;