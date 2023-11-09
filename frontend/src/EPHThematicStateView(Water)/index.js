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
import FadeInSection from "../FadeInSection.js"
const React = require("react");
const Component = React.Component;

class EPHThematicWaterStateMap extends Component {
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
      geoAverages: {}

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
    
    if(this.props.measure === "arsenic in water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/769/102/all/all/1/2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999/0/0?PMDisplayId=2`
    }
    else if (this.props.measure === "deph in water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/802/102/all/all/1/2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999/0/0?PMDisplayId=2`    
    }
    
    else if (this.props.measure === "pce in water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/807/102/all/all/1/2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999/0/0?PMDisplayId=2`
    }

    else if (this.props.measure === "pfas in water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/734/184/all/all/2/2015/0/0?ContaminantId=1`
    }
    else if (this.props.measure === "radium in water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/817/102/all/all/1/2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999/0/0?PMDisplayId=2`
    }
    else if (this.props.measure === "tce in water") { //not sure if this is the right one 
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/812/102/all/all/1/2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999/0/0?PMDisplayId=2`
    }
    else if (this.props.measure === "uranium in water") {
      return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/822/102/all/all/1/2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999/0/0?PMDisplayId=2`
    }
    

  }

  async getCountyData() {
    const apiUrl = this.getApiURL();

    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        const countyData = response.data.cwsTableResult;

        // Calculate averages for each geoId
        const geoAverages = {};
        countyData.forEach((item) => {
          const geoId = item.geoId;
          const dataValue = parseFloat(item.dataValue);
          if (!isNaN(dataValue)) {
            if (geoAverages[geoId] === undefined) {
              geoAverages[geoId] = {
                total: dataValue,
                count: 1,
              };
            } else {
              geoAverages[geoId].total += dataValue;
              geoAverages[geoId].count += 1;
            }
          }
        });

        // Calculate final averages
        for (const geoId in geoAverages) {
          const average = geoAverages[geoId].total / geoAverages[geoId].count;
          geoAverages[geoId] = average;
        }

        this.setState({ countyData, geoAverages });
      } else {
        console.error("Unexpected error. Status code:", response.status);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }
  
  
    
  render() {
    
    return (
      <div className="thematic-view-container">
        <div className="flex-item">
          <h1>{this.props.measure} in {this.props.stateLongName}</h1>
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

export default EPHThematicWaterStateMap;