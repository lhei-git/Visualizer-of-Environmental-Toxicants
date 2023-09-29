
const React = require("react");
const { years } = require("../contants");

function EPHFilters(props) {

    function onFilterChange(event) { 
        const target = event.target;
        const filters = Object.assign({}, props.filters);
        if (target.name === "year") filters[target.name] = parseInt(value);
        else filters[target.name] = value;
        
        props.onFilterChange(filters);
    }
        
    function getYears() {
        let yearOptions = [];
        for (let i = years.end; i >= years.start; i--) {
        yearOptions.push(
            <option defaultValue={i === years.end} key={i} value={i}>
            {i}
            </option>
        );
        }
        return yearOptions;
    }


    function getReleaseTypes() {
        const types = ["Biomonitoring: Population Exposures"];

        return types.map((type) => {
        return (
            <option key={type} value={type}>
            {type.replace("_", "-")}
            </option>
        );
        });
    }

    return (
    <div style={{ display: "flex" }}>
      <div className="control-header">
        {props.map && <h1>{getLocationString(props.map, true)}</h1>}
      </div>
      <div className="control-container">
        <div className="content">
          {/* Search Bar Content*/}
          <select
            name="year"
            value={props.filters.year}
            onChange={onFilterChange}
            id=""
          >
            {getYears()}
          </select>
          <select
            name="releaseType"
            value={props.filters.releaseType}
            onChange={onFilterChange}
            id=""
          >
            {getReleaseTypes()}
          </select>
            
          </div>
        </div>
      </div>

);
    



}

export default EPHFilters;