//==========================================
// Author: Farzana Israt
//==========================================
import ReactTooltip from "react-tooltip";
import SimpleMap from "../EPHMapView";
import LoadingSpinner from "../LoadingSpinner";
import vetapi from "../api/vetapi";
import "./index.css";
import data from "../data/stateLocationData.json";
import Title from "../Title/index.js";
import axios from "axios";
import EPHMap from "../EPHMap/index";
const React = require("react");
const Component = React.Component;

class EPHThematicStateMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /*update to latest year*/
      selectedYear: this.props.yearRange[0],
      //contentCounty: "",
      geoUrl: "",
      stateName: "",
      prevStateName: "",
      countyData: null,
      measure: "",
      gender: "all",
      scale: null,
      lat: null,
      lon: null,

    };
    
    this.handleContentCountyState = this.handleContentCountyState.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }
  
 

  componentDidMount() {
    this.getCountyData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.filter !== this.props.filter) {
      this.setState(
        {
          countyData: null,
        },
        () => {
          this.getCountyData();
        }
      );
    }
    //sets scaling and positioning for the map projection
    if (this.state.prevStateName !== this.props.stateName) {
      this.setState({ prevStateName: this.props.stateName });
      const found = data.find((e) => e.state === this.props.stateName);
      
      
      if(found) {
        this.setState({
          lat: found.latitude,
          lon: found.longitude,
          scale: found.scale,
          geoUrl: found.geoUrl,
          stateLongName: found.name,

        
        });
      }
    else {
        this.setState({
          lat: 45.3504,
          lon: -85.5603,
          scale: 3400,
          geoUrl: "https://raw.githubusercontent.com/missisrat/topology/main/MI.json",
          
        })
      }
    }
  }
  
    
  

  
  handleContentCountyState(content) {
    this.setState({ content: content });
  }


/*
  getMeasureInfo(measure) {
    
    const measureInfo = {
      "adult asthma": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1038/2/all/all/1/{year}/0/0`,
        yearRange: [2020, 2019, 2018],
      },
      "asthma hospitalizations": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/99/2/all/all/1/{year}/0/0`,
        yearRange: [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
      },
      "prevalence of cancer": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1095/2/all/all/1/{year}/0/0`,
        yearRange: [2020, 2019, 2018],
      },
      "fertility rate": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/45/2/all/all/1/{year}/0/0`,
        yearRange: [ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000],
      },
      "heart attack": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/553/2/all/all/1/{year}/1/0`,
        yearRange: [ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000],
      },
      "infant mortality": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/279/2/all/all/2/2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004/1/0`,
        yearRange: [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004],
      },
      "low birthweight": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/553/2/all/all/1/{year}/1/0`,
        yearRange: [ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000],
      },
      "prematurity": {
        apiUrl: `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/30/2/all/all/1/{year}/1/0`,
        yearRange: [ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000],
      },
    };

    return measureInfo[measure] || null;
  }

*/
  getApiURL() {
    
    const selectedYear = this.state.selectedYear;
    const selectedGender = this.state.gender;

    if(this.props.measure === "Asthma Among Adults") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1038/2/all/all/1/${selectedYear}/0/0`
    }
    else if (this.props.measure === "Hospitalizations from Asthma") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/99/2/all/all/1/${selectedYear}/0/0`    
    }
    
    else if (this.props.measure === "Prevalence of Cancer") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1095/2/all/all/1/${selectedYear}/0/0`
    }

    else if (this.props.measure === "Fertility Rate") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/45/2/all/all/1/${selectedYear}/0/0`
    }
    else if (this.props.measure === "Heart Attack") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/553/10/all/all/1/${selectedYear}/1/0?GenderId=${selectedGender}`
    }
    else if (this.props.measure === "Infant Mortality") { //not sure if this is the right one 
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/279/2/all/all/2/${selectedYear}/1/0`
    }
    else if (this.props.measure === "Low Birthweight") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/36/10/all/all/1/${selectedYear}/1/0?GenderId=${selectedGender}`
    }
    else if (this.props.measure === "Prematurity") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/30/10/all/all/1/${selectedYear}/1/0?GenderId=${selectedGender}`
    }
    
    /*

    const { measure, selectedYear } = this.state;
    const measureInfo = this.getMeasureInfo(measure);

    if (measureInfo && measureInfo.yearRange.includes(selectedYear)) {
      // Replace "{year}" in the URL with the selected year
      return measureInfo.apiUrl.replace("{year}", selectedYear);
    } else {
      console.error(
        `Selected year ${selectedYear} is not available for the current measure.`
      );
      return "";
    }
    */
  }

  async getCountyData() {
    const apiUrl = this.getApiURL();

    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        this.setState({ countyData: response.data.tableResult });
      } else {
        console.error("Unexpected error. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a non-2xx status code
        console.error("Error response from the server:", error.response.status);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received. Request made but no response.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up the request:", error.message);
      }
    }
    
  }
  
  handleYearChange = (event) => {
    this.setState({ selectedYear: event.target.value }, () => {
      this.getCountyData(); 
    });
  };
  
  handleGenderChange = (event) => {
    this.setState({ gender: event.target.value }, () => {
      this.getCountyData(); 
    });
  };
  
    
  
  render() {
    const selectedYear = this.state.selectedYear;
    const yearOptions = this.props.yearRange;

    return (
      <div className="thematic-state-container">
        <div className="flex">
        <h1>{this.props.measure} in {this.props.stateLongName}</h1>
        <div className="centered-year">
        <select
          value={selectedYear}
          onChange={this.handleYearChange}
          style={{ fontSize: '18px', marginBottom: '50px' }}
        >
          
          {yearOptions.map((year) => (
            
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        </div>
        
        {["Heart Attack", "Low Birthweight", "Prematurity"].includes(this.props.measure) && (
          <div className="centered-gender">
            <select
              value={this.state.gender}
              onChange={this.handleGenderChange}
              style={{ fontSize: '18px', marginBottom: '50px' }}
            >
              <option>Select a Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>
        )}
        
          {this.state.countyData ? (
            
              <EPHMap
                data={this.state.countyData}
                geoUrl={this.state.geoUrl}
                mapType={"singleState"}
                lon={this.state.lon}
                lat={this.state.lat}
                scale={this.state.scale}
               />
            
          ) : (
            <LoadSpinner />
          )
          
          }


        </div>
      </div>
    );
  }

  
  
  

  
  

  
}


function LoadSpinner() {
  return (
    <div
      style={{
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingSpinner></LoadingSpinner>
    </div>
  );
}

export default EPHThematicStateMap;