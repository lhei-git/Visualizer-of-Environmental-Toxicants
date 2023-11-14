//==========================================
// Author: Evan de Jesus
// Date:   12/10/2020
//==========================================


/* eslint-disable import/first */
require("dotenv").config();
import {
  Router,
  Switch,
  Route,
  Link,
  withRouter,
  useLocation,
  Redirect,
} from "react-router-dom";
import "./App.css";
import "./index.css";
import history from "./history";
import Home from "./HomeView";
import GraphView from "./GraphView";
import DataComp from "./DataComparison/index";
import ThematicMapView from "./ThematicMapView/index.js";
import AboutPage from "./About/index";


import EPHData from "./EPHData/index";

import React, { useImperativeHandle, useReducer } from "react";
import MapView from "./MapView";
import PropTypes from "prop-types";
import SimpleMap from "./EPHMapView/index";
import EPHHome from "./EPHData/index";




/* Initial state of app */
const initialState = {
  map: JSON.parse(sessionStorage.getItem("map")),
  filters: {
    chemical: "all",
    pbt: false,
    carcinogen: false,
    releaseType: "all",
    /*sets initial state to latest year*/
    year: 2022,
  },
  errorMessage: "",
};


/* handler for updating state */
const reducer = (state, action) => {
  switch (action.type) {
    case "setMap":
      /* Store latest searched location in session */
      sessionStorage.setItem("map", JSON.stringify(action.payload));
      return {
        ...state,
        map: action.payload,
      };
    case "setFilters":
      const newFilters = Object.assign({}, action.payload);
      return { ...state, filters: newFilters };


    case "setErrorMessage":
      return { ...state, errorMessage: action.payload };
    default:
      throw new Error();
  }
};


/* individual state setters */
const setMap = (payload) => ({ type: "setMap", payload });
const setFilters = (payload) => ({ type: "setFilters", payload });
const setErrorMessage = (payload) => ({ type: "setErrorMessage", payload });


/* Navbar component */
const Navbar = (props) => {
  // webpage path
  const location = useLocation();


  /* Only shows other paths when a search has been initiated */
  return (
    <div
      className={`navigation ${location.pathname === "/" ? "transparent" : ""}`}
    >
      <ul>
        <li className={location.pathname === "/" ? "active" : ""}>
        <Link to="/">Search</Link>
        </li>
       
       
        {props.visible && (
          <>
            <li className={location.pathname === "/graphs" ? "active" : ""}>
              <Link to="/graphs">Toxic Releases</Link>
            </li>
            <li className={location.pathname === "/ephdata" ? "active" : ""}>
              <Link to="/ephdata">Health Outcomes</Link>
            </li>
            <li className={location.pathname === "/datacomp" ? "active" : ""}>
              <Link to="/datacomp">Data Comparison</Link>
            </li>
            {/* Remove national insights page
            <li className={location.pathname === "/thematicmaps" ? "active" : ""}>
              <Link to="/thematicmaps">National Insights</Link>
            </li>*/}
            
          </>
        )}
                <li className={location.pathname === "/about" ? "active" : ""}>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <div className="logo">
        <Link to="/">VETHOS.</Link>
      </div>
    </div>
  );
};
Navbar.propTypes = {
  visible: PropTypes.bool,
};


/* Footer component */
/* Added VET 2023 upgrade written by Al-Taimee*/
function Footer() {
  return (
    <div className="footer">
      <div className="copyright">&#169; VETHOS 2023</div>
    </div>
  );
}


const App = (props) => {
  /* Use reducer method to update state */
  const [state, dispatch] = useReducer(reducer, initialState);


  /* Error handler when API is down */
  function toggleError() {
    dispatch(setErrorMessage("Server request failed, please try again later."));
    setTimeout(() => {
      dispatch(setErrorMessage(""));
    }, 10000);
 
  }

  /* The geocoder has completed a successful search */
  function handleSuccess(map) {
    /* Set app-wide location setting */
    dispatch(setMap(map));
    /* Clear existing facility data */
    sessionStorage.removeItem("facilityData");
    /* redirect to the /map page */
    history.push("/graphs");
  }

  /*if no internet detected, display alert written by Al-Taimee*/
  var checkIfOnline = navigator.onLine;
    if (checkIfOnline == false) {
        alert("Internet not detected, please reload once connection has been re-established"); 
        setTimeout(5000)
      }

  /*function scrollBtnUp() {
    return {
      <div className="scollUp">
        <a href="#" class="scroll-btn">
          <i class="fas fa-arrow-up"></i>
        </a>
      </div>
    };
  }*/

  return (
    /* Entire app is wrapped by router object. Router handles requests to other pages */
    <Router history={history}>
      <Navbar visible={!!state.map} />
      {state.errorMessage !== "" && (
        <div className="error" onClick={() => dispatch(setErrorMessage(""))}>
          {state.errorMessage}
          <div>x</div>
        </div>
      )}
      <div className="app-container">
        <Switch>
          <Route exact path="/map">
            {/* Map, summary, and state thematic map */}
            <MapView
              map={state.map}
              filters={state.filters}
              onFilterChange={(filters) => dispatch(setFilters(filters))}
            ></MapView>
          </Route>
          <Route path="/graphs">
            {/* Top ten graphs, timeline graphs, index graphs */}
            {state.map ? (
              <div className="graph-view">
                <GraphView
                  map={state.map}
                  filters={state.filters}
                  onApiError={toggleError}
                  onFilterChange={(filters) => dispatch(setFilters(filters))}
                ></GraphView>
              </div>
            ) : (
              <Redirect to="/" />
            )}
          </Route>
         
          <Route path="/thematicmaps">
            {/* county and state-level thematic maps for U.S. */}
            {state.map ? (
              <ThematicMapView
                map={state.map}
                filters={state.filters}
                onApiError={toggleError}
                onFilterChange={(filters) => dispatch(setFilters(filters))}
              ></ThematicMapView>
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          
          <Route path="/ephdata">
            {/*farzana israt*/}
            <EPHHome map={state.map}/>
          </Route>

          {/* Amrita - Adding back in the Data Comparison page */}
          <Route path="/datacomp">
            <DataComp map={state.map} filters={state.filters}/>
          </Route>

          <Route path="/about" component={AboutPage}></Route>
          <Route path="/">
            {/* home page */}
            <Home onSuccess={handleSuccess} />
          </Route>
        </Switch>
        <Footer></Footer>
      </div>
    </Router>
  );
};


export default withRouter(App);

