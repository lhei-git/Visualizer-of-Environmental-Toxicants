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
      latestYear: 2022,
      //contentCounty: "",
      geoUrl: "",
      stateName: "",
      prevStateName: "",
      countyData: null,
      measure: "",
      scale: null,
      lat: null,
      lon: null,

    };
    
    this.handleContentCountyState = this.handleContentCountyState.bind(this);
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

  getApiURL() {
    
    if(this.props.measure === "adult asthma") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1038/2/all/all/1/2020,2019,2018/0/0`
    }
    else if (this.props.measure === "asthma hospitalizations") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/99/2/all/all/1/2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000/0/0`    
    }
    
    else if (this.props.measure === "prevalence of cancer") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1095/2/all/all/1/2020,2019,2018/0/0`
    }

    else if (this.props.measure === "fertility rate") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/45/2/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000/0/0`
    }
    else if (this.props.measure === "heart attack") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/553/2/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000/1/0`
    }
    else if (this.props.measure === "infant mortality") { //not sure if this is the right one 
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/279/2/all/all/2/2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004/1/0`
    }
    else if (this.props.measure === "low birthweight") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/553/2/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000/1/0`
    }
    else if (this.props.measure === "prematurity") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/30/2/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000/1/0`
    }
    

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
  
  
    
  render() {
    
    return (
      <div className="thematic-view-container">
        <div className="flex-item">
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