import ReactTooltip from "react-tooltip";
import SimpleMap from "../EPHMapView";
import LoadingSpinner from "../LoadingSpinner";
import vetapi from "../api/vetapi";
import "./index.css";
import data from "../data/stateLocationData.json";
import Title from "../Title/index.js";
import axios from "axios";
import EPHReusableMap from "../EPHReusable/index";
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
    if (prevProps !== this.props) {
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
    }
    
    }
    
  

  
  handleContentCountyState(content) {
    this.setState({ content: content });
  }


  
  
    
  render() {

    return (
      <div className="thematic-view-container">
        <div className="flex-item">
          {this.state.countyData && (
            
              <EPHReusableMap
                data={this.state.countyData}
                geoUrl={this.state.geoUrl}
                mapType={"singleState"}
                lon={this.state.lon}
                lat={this.state.lat}
                scale={this.state.scale}
               />
            
          ) 
          }
        </div>
      </div>
    );
  }
  

  async getCountyData() {
    try {
      const response = await axios.get("https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/822/102/all/all/1/2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999/0/0?PMDisplayId=1,2,3&apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744");
      this.setState({ countyData: response.data.cwsTableResult });
    } catch (error) {
      console.log("Error fetching county data: ", error);
    }
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