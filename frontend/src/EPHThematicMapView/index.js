import ReactTooltip from "react-tooltip";
import ThematicMap from "../ThematicMap/index.js";
import LoadingSpinner from "../LoadingSpinner";
import Filters from "../Filters";
import vetapi from "../api/vetapi";
import Title from "../Title/index.js";
import EPHReusable from "../EPHReusable/index.js";
import axios from "axios";
const React = require("react");
const Component = React.Component;

const stateGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
//const countyGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json";

class EPHThematicMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestYear: 2022,
      contentState: "",
      contentCounty: "",
      stateData: null,
      //countyData: null,
      selectedMeasure: null,
    };

    //this.handleContentState = this.handleContentState.bind(this);
    //this.handleContentCounty = this.handleContentCounty.bind(this);
  }

  componentDidMount() {
    this.getStateData();
    //this.getCountyData();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.selectedMeasure !== this.props.selectedMeasure) {
      this.setState(
        {
          stateData: null,
          countyData: null,
        },
        () => {
          this.getStateData();
          //this.getCountyData();
        }
      )
    }
  }

  handleContentState(content) {
    this.setState({ contentState: content });
  }
/*
  handleContentCounty(content) {
    this.setState({ contentCounty: content });
  }
*/
  render() {
    return (
      <div className="mapView">
        <div className="flex-item">
          <div className="graph-header">
            {/*
            <Title
              text="by state"
              map={this.props.map}
              ></Title>
            */}
          </div>
          {this.state.stateData ? (
            <>
            <EPHReusable
              map={this.state.map}
              data={this.state.stateData}
              geoUrl={stateGeoUrl}
              mapType={"states"}
              measure={this.state.selectedMeasure}
              />
            </>
          ) : (
            <LoadSpinner />
          )}
        </div>
{/*
        <div className="flex-item">
          {/* 
          <div className="graph-header">
            <Title
              text="by county"
              map={this.props.map}
              ></Title>
          </div>
          
          {this.state.countyData ? (
            <>
              <EPHReusable
                data={this.state.countyData}
                geoUrl={countyGeoUrl}
                mapType={"counties"}
                
                />
            </>
          ) : (
            <LoadSpinner />
          )}
        </div>
          */}
      </div>
    );
  }
  

 async getStateData() {
    const apiURL = 'https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/3/all/all/1/2020,2019,2018,2017,2016,2015,2014,2013,2012,2011/0/0?AgeBandId=1,2,3,4';

        axios.get(apiURL)
        .then((response) => {
            this.setState({stateData: response.data.tableResult});
        })
        .catch((error) => {
            console.error("error: ", error);
        })

  }
  
/*
  async getStateApiURL(selectedMeasure, year) {
    const [selectedYear, setSelectedYear] = useState([]);
      setSelectedYear(year);
      switch(selectedMeasure) {
        case "asthma in children": 
                return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/587/3/all/all/1/${year}/0/0?AgeBandId=1,2,3,4`;
            case "childhood cancer: brain & central":
                return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/67/4/all/all/1/${year}/0/0?GenderId=1,2`;
            case "childhood cancer: leukemia":
                return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/71/4/all/all/1/${year}/0/0?GenderId=1,2`        
      }

     React.useEffect(() => {
        if(selectedYear) {
          this.getStateApiURL(measure, selectedYear);
        }
     }, [selectedYear]); 
  }

*/


 

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
  )
}

export default EPHThematicMapView;