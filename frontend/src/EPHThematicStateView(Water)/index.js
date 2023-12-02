//==========================================
// Author: Farzana Israt
//==========================================
import ReactTooltip from "react-tooltip";
import SimpleMap from "../EPHMapView";
import LoadingSpinner from "../LoadingSpinner";
import vetapi from "../api/vetapi";
import data from "../data/stateLocationData.json";
import Title from "../Title/index.js";
import axios from "axios";
import EPHMap from "../EPHMap/index";
import "./index.css";
const React = require("react");
const Component = React.Component;

class EPHThematicWaterStateMap extends Component {
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
      level: "2",
      contaminant: "1",
      scale: null,
      lat: null,
      lon: null,
      //geoAverages: {}

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
    "arsenic in water": [2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]
    "deph in water": [2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]
    "pce in water": [2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]
    "pfas in water": [2015]
    "radium in water": [2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]
    "tce in water": [2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]
    "uranium in water": [2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]

  */

    /*get url from eph site*/
  getApiURL() {
    const selectedYear = this.state.selectedYear;
    const selectedLevel = this.state.level;
    const selectedContaminant = this.state.contaminant;

    if(this.props.measure === "Arsenic in Community Water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/769/102/all/all/1/${selectedYear}/0/0?PMDisplayId=${selectedLevel}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "DEPH in Community Water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/802/102/all/all/1/${selectedYear}/0/0?PMDisplayId=${selectedLevel}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`    
    }
    
    else if (this.props.measure === "PCE in Community Water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/807/102/all/all/1/${selectedYear}/0/0?PMDisplayId=${selectedLevel}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }

    else if (this.props.measure === "PFAS in Community Water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/734/184/all/all/2/${selectedYear}/0/0?ContaminantId=${selectedContaminant}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "Radium in Community Water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/817/102/all/all/1/${selectedYear}/0/0?PMDisplayId=${selectedLevel}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744`
    }
    else if (this.props.measure === "TCE in Community Water") { //not sure if this is the right one 
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/812/102/all/all/1/${selectedYear}/0/0?PMDisplayId=${selectedLevel}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744
      `
    }
    else if (this.props.measure === "Uranium in Community Water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/822/102/all/all/1/${selectedYear}/0/0?PMDisplayId=${selectedLevel}&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744
      `
    }
    

  }

  /*get data or each county that is not a drinking water measure*/
  async getCountyData() {
    const apiUrl = this.getApiURL();
  
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        const rawData = response.data.cwsTableResult;
  
        const geoIdData = {};
  
        rawData.forEach((entry) => {
          const { geoId, dataValue } = entry;
  
          if (geoId in geoIdData) {
            geoIdData[geoId].sum += parseFloat(dataValue) || 0;
            geoIdData[geoId].count += 1;
          } else {
            geoIdData[geoId] = { sum: parseFloat(dataValue) || 0, count: 1 };
          }
        });
  
        const averagedData = Object.entries(geoIdData).map(([geoId, values]) => {
          const averageValue = values.sum / values.count;
          return { geoId, dataValue: isNaN(averageValue) ? null : averageValue };
        });
  
        this.setState({ countyData: averagedData });
      } else {
        console.error("Unexpected error. Status code:", response.status);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }
  

  /*get units for tooltip*/
  getUnits(endUnits) {
    if(this.props.measure === "Arsenic in Community Water") {
      return endUnits = "(µg/L)"
    }
    else if (this.props.measure === "DEPH in Community Water") {
      return endUnits = "(µg/L)"
    }
    
    else if (this.props.measure === "PCE in Community Water") {
      return endUnits = "(µg/L)"
    }

    else if (this.props.measure === "PFAS in Community Water") {
      return endUnits = "(Concentration)"
    }
    else if (this.props.measure === "Radium in Community Water") {
      return endUnits = "(pCi/L)"
    }
    else if (this.props.measure === "TCE in Community Water") { 
      return endUnits = "(µg/L)"
      
    }
    else if (this.props.measure === "Uranium in Community Water") {
      return endUnits = "(µg/L)"
      
    }

  }

/*more descriptive title under the main title for each measure*/  
  getSubtitle(subtitle) {
    if(this.props.measure === "Arsenic in Community Water") {
      return subtitle = "Annual Mean Concentration of Arsenic (µg/L)"
    }
    else if (this.props.measure === "DEPH in Community Water") {
      return subtitle = "Annual Mean Concentration of DEHP (µg/L)"
    }
    
    else if (this.props.measure === "PCE in Community Water") {
      return subtitle = "Annual Mean Concentration of PCE (µg/L)"
    }

    else if (this.props.measure === "PFAS in Community Water") {
      return subtitle = "CWS with Detections of PFAS Chemicals (PFOS, PFOA, PFNA, PFBS, PFHxS, PFHpA)"
    }
    else if (this.props.measure === "Radium in Community Water") {
      return subtitle = "Annual Mean Concentration of Radium (pCi/L)"
    }
    else if (this.props.measure === "TCE in Community Water") { 
      return subtitle = "Annual Mean Concentration of TCE (µg/L)"
      
    }
    else if (this.props.measure === "Uranium in Community Water") {
      return subtitle = "Annual Mean Concentration of Uranium (µg/L)"
      
    }

  }  
  
  
  /*year dropdown configuration*/
  handleYearChange = (event) => {
    this.setState({ selectedYear: event.target.value }, () => {
      this.getCountyData(); // Fetch data with the updated year
    });
  };
  
  /*level change configuration*/
  handleLevelChange = (event) => {
    this.setState({ level: event.target.value }, () => {
      this.getCountyData(); 
    });
  };

  /*contaminant level configuration*/
  handleContaminantChange = (event) => {
    this.setState({ contaminant: event.target.value }, () => {
      this.getCountyData(); 
    });
  };
  
  
    
  render() {
    const selectedYear = this.state.selectedYear;
    const yearOptions = this.props.yearRange;

    return (
      <div className="thematic-view-container">
        <div className="eph-flex-item">
          
          <h1>{this.props.measure} in {this.props.stateLongName}</h1>
          <h3>{this.getSubtitle()}</h3>
          <div className="centered-dropdown">
          <div className="centered-year">
            <label>Select a Year of Interest:  </label>
          <select
            value={selectedYear}
            onChange={this.handleYearChange}
            style={{ fontSize: '18px', marginBottom: '30px' }}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          </div>


          {["Arsenic in Community Water", "DEPH in Community Water", "PCE in Community Water", "Radium in Community Water", "TCE in Community Water", "Uranium in Community Water"].includes(this.props.measure) && (
            <div className="centered-level">
              <label>Select an MCL Level: </label>
              <select
                value={this.state.level}
                onChange={this.handleLevelChange}
                style={{ fontSize: '18px', marginBottom: '50px' }}
              >
                <option value="1">Maximum contaminant level: Greater than MCL</option>
                <option value="2">Maximum contaminant level: Less Than or Equal to MCL</option>
                <option value="3">Maximum contaminant level: Not Detected</option>
              </select>
            </div>
          )}

          {["PFAS in Community Water"].includes(this.props.measure) && (
            <div className="centered-contaminant">
              <label>Select a Contaminant: </label>
              <select
                value={this.state.contaminant}
                onChange={this.handleContaminantChange}
                style={{ fontSize: '18px', marginBottom: '50px' }}
              >
                <option>Select a Contaminant</option>
                <option value="1">PFOS</option>
                <option value="2">PFOA</option>
                <option value="3">PFNA</option>
                <option value="4">PFHxS</option>
                <option value="5">PFHpA</option>
                <option value="6">PFBS</option>
              </select>
            </div>
          )}
        </div>
          
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

export default EPHThematicWaterStateMap;