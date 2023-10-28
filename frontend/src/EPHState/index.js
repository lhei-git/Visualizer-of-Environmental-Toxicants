import ReactTooltip from "react-tooltip";
import SimpleMap from "../EPHMapView";
import LoadingSpinner from "../LoadingSpinner";
import vetapi from "../api/vetapi";
import "./index.css";
import data from "../data/stateLocationData.json";
import Title from "../Title/index.js";
const React = require("react");
const Component = React.Component;

class EPHThematicStateMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /*update to latest year*/
      latestYear: 2022,
      contentCounty: "",
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

  
    //sets scaling and positioning for the map projection
    if (this.state.prevStateName !== this.props.stateName) {
      this.setState({ prevStateName: this.props.stateName });
      const found = data.find((e) => e.state === this.props.stateName);

      this.setState({
        lat: found.latitude,
        lon: found.longitude,
        scale: found.scale,
        geoUrl: found.geoUrl,
        stateLongName: found.name,
      });
    }
  }
  handleContentCountyState(content) {
    this.setState({ content: content });
  }

  render() {
    return (
      <div className="thematic-view-container">
        <div className="flex-item">
          {this.state.countyData ? (
            <>
              <EPHThematicStateMap
                data={this.state.countyData}
                geoUrl={this.state.geoUrl}
                mapType={"singleState"}
                stateName={this.props.stateName}
                lat={this.state.lat}
                lon={this.state.lon}
                scale={this.state.scale}
              />
              <ReactTooltip multiline={true} html={true}>
                {this.state.content}
              </ReactTooltip>
            </>
          ) : (
            <LoadSpinner />
          )}
        </div>
      </div>
    );
  }

  async getCountyData() {
    
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