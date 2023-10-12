
import React from "react";
import SimpleMap from "../EPHMapView";
import EPHHome from "../EPHData";
import "./index.css"

function EPHDataViewer() {
    const [currentTab, setCurrentTab] = React.useState(
        parseInt(sessionStorage.getItem("currentTab")) || 0
      );
      
      function chooseTab(i) {
        sessionStorage.setItem("currentTab", i);
        setCurrentTab(i);
      }

      return (
        <div className="mapView">
        <div className="selector">
        <ul>
          <li
            onClick={() => chooseTab(0)}
            className={currentTab === 0 ? "active" : ""}
          >
            Maps
          </li>
          <li
            onClick={() => chooseTab(1)}
            className={currentTab === 1 ? "active" : ""}
          >
            Timelines
          </li>
          <li
            onClick={() => chooseTab(2)}
            className={currentTab === 2 ? "active" : ""}
          >
            Tables
          </li>
        </ul>
      </div>
    {currentTab === 0 && (
        <SimpleMap />
    )}
    {currentTab === 1 && (
        <EPHHome />
    )}
    </div>
      )
}

export default EPHDataViewer;