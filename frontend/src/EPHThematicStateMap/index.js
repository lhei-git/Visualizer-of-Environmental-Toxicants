//==========================================
// Author: Farzana Israt
//==========================================
//Some of this code mimics the previous team's code in ThematicStateMap

//Creating maps for each state for county-level that are non-drinking water measures
import LoadingSpinner from "../LoadingSpinner";
import "./index.css";
import data from "../data/stateLocationData.json";
import axios from "axios";
import EPHMap from "../EPHMap/index";
const React = require("react");
const Component = React.Component;

//Creating class
class EPHThematicStateMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /*update to latest year*/
      selectedYear: this.props.yearRange[0],
      geoUrl: "",
      stateName: "",
      prevStateName: "",
      countyData: null,
      measure: "",
      gender: "1",
      scale: null,
      lat: null,
      lon: null,

    };
    
    this.handleYearChange = this.handleYearChange.bind(this);
  }
  
 
//Getting county data on mount
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
  
    
//Get URL from EPH API
  getApiURL() {
    
    //Filtering through years for each measure
    const selectedYear = this.state.selectedYear;
    //Filtering through gender for each measure that has a gender dropdown
    const selectedGender = this.state.gender;

    if(this.props.measure === "Asthma Among Adults") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1038/2/all/all/1/${selectedYear}/0/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "Hospitalizations from Asthma") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/99/2/all/all/1/${selectedYear}/0/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`    
    }
    
    else if (this.props.measure === "Prevalence of Cancer") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1095/2/all/all/1/${selectedYear}/0/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }

    else if (this.props.measure === "Fertility Rate") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/45/2/all/all/1/${selectedYear}/0/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "Heart Attack") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/553/10/all/all/1/${selectedYear}/1/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "Infant Mortality") { 
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/279/2/all/all/2/${selectedYear}/1/0?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "Low Birthweight") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/36/10/all/all/1/${selectedYear}/1/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "Prematurity") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/30/10/all/all/1/${selectedYear}/1/0?GenderId=${selectedGender}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    
    
  }

  //Get units for displaying in tooltip of the map
  getUnits(endUnits) {
    if(this.props.measure === "Asthma Among Adults") {
      return endUnits = "(Percent)"; 
    }
    else if (this.props.measure === "Hospitalizations from Asthma") {
      return endUnits = "(Counts)"    
    }
    
    else if (this.props.measure === "Prevalence of Cancer") {
      return endUnits = "(Percent)"  
    }

    else if (this.props.measure === "Fertility Rate") {
      return endUnits = "(Rate)" 
    }
    else if (this.props.measure === "Heart Attack") {
      return endUnits = "(Rate)" 
    }
    else if (this.props.measure === "Infant Mortality") { 
      return endUnits = "(Rate)" 
    }
    else if (this.props.measure === "Low Birthweight") {
      return endUnits = "(Percent)" 
    }
    else if (this.props.measure === "Prematurity") {
      return endUnits = "(Percent)" 
    }

  }


  //More descriptive title under the main title for each measure
  getSubtitle(subtitle) {
    if(this.props.measure === "Asthma Among Adults") {
      return subtitle = "Crude Prevalence of Current Asthma among Adults >= 18 Years of Age"; 
    }
    else if (this.props.measure === "Hospitalizations from Asthma") {
      return subtitle = "Annual Number of Hospitalizations for Asthma"    
    }
    
    else if (this.props.measure === "Prevalence of Cancer") {
      return subtitle = "Crude Prevalence of Cancer among Adults >= 18 Years of Age"  
    }

    else if (this.props.measure === "Fertility Rate") {
      return subtitle = "Total Fertility Rate per 1000 women" 
    }
    else if (this.props.measure === "Heart Attack") {
      return subtitle = "Crude Death Rate from Heart Attack among People >=35 Years of Age per 100,000 Population" 
    }
    else if (this.props.measure === "Infant Mortality") { 
      return subtitle = "Infant (<1 Year of Age) Mortality Rate per 1000 Live Births Over a 5-year Period" 
    }
    else if (this.props.measure === "Low Birthweight") {
      return subtitle = "Percent of Low Birthweight (<2500g) Live Singleton Births" 
    }
    else if (this.props.measure === "Prematurity") {
      return subtitle = "Percent of Preterm (<37 Weeks Gestation) Live Singleton Births" 
    }

  }


  //Get data for each county that is not a drinking water measure
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
        console.error("Error response from the server:", error.response.status);
      } else if (error.request) {
        console.error("No response received. Request made but no response.");
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
    
  }
  
  //Year dropdown configuration
  handleYearChange = (event) => {
    this.setState({ selectedYear: event.target.value }, () => {
      this.getCountyData(); 
    });
  };
  
  //Gender dropdown configuration
  handleGenderChange = (event) => {
    this.setState({ gender: event.target.value }, () => {
      this.getCountyData(); 
    });
  };
  
    
  
  render() {
    
    const selectedYear = this.state.selectedYear;
    const yearOptions = this.props.yearRange;

    return (
      <div className="thematic-eph-state-container">
        <div className="state-flex">
          
        <h1>{this.props.measure} in {this.props.stateLongName}</h1>
        <h3>{this.getSubtitle()}</h3>
        <div className="centered-dropdown">
          {/* Year dropdown */}
        <div className="centered-year">
          <label>Select a Year of Interest: </label>
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
        
         {/* Gender dropdown */}
        {["Heart Attack", "Low Birthweight", "Prematurity"].includes(this.props.measure) && (
          <div className="centered-gender">
            <label>Select a Gender: </label>
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
        </div>
        
        {/* If data loads, create county-level state map. If not, load spinner */}
          {this.state.countyData ? (
            
              <EPHMap
                data={this.state.countyData}
                geoUrl={this.state.geoUrl}
                mapType={"singleState"}
                lon={this.state.lon}
                lat={this.state.lat}
                scale={this.state.scale}
                units={this.getUnits()}
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