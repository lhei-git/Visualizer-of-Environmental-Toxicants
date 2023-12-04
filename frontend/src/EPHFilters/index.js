import "./index.css";

const React = require("react");

function filters(){
  return(
    <div className="filter-container">
      <div className="indicator-filter">
        <select id="indicator">
          <option value="emergency">Emergency Department Visits For Asthma</option>
          <option value="hospitalizations">Hospitalizations for Asthma</option>
          <option value="adult">Prevalence of Asthma among Adults</option>
          <option value="children">Prevalence of Asthma among Children</option>
        </select>
      </div>
      <div className="measure-filter">
      <select id="measure">
              <option value="emergency">Age adjusted Rate of Hospitalizations for Asthma per 10,000 Population</option>
              <option value="hospitalizations">Annual Number of Hospitalizations for Asthma</option>
              <option value="adult">Crude Rate of Hospitalizations for Asthma per 10,000 Population</option>
        </select>
      </div>
    </div>
  )

}

export default filters();