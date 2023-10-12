import "./index.css";
import EPHChart from "../EPHCharts/index.js";
import {useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
const React = require("react");



function EPHData() {
  const [value,setValue] = useState('');
  const handleSelect = (e) =>{
    console.log(e);
    setValue(e);
  }
  return (
    <div className="eph-container">
      <div className="eph-dropdown">
      <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Dropdown Button
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="lead">Lead in Blood</Dropdown.Item>
            <Dropdown.Item eventKey="pfos">PPFOS & PFOA Surfactants in Blood</Dropdown.Item>
            <Dropdown.Item eventKey="metals">Metals and Metalloids</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="lead-header">
      
      </div>
      <div className="chart">
        <Tab value={value}/>
      </div>
    </div>
  );
}

function Tab({value}){
  if (value.toString() == 'lead'){ //maybe change tostring and ===
    return <EPHChart/>
  }
  else if (value.toString() == 'pfos'){
    return <p>pfos</p>
  }
  else if (value.toString() == 'metals'){
    return <p>metals</p>
  }
  else{
    return <p>errors</p>
  }
}

export default EPHData;