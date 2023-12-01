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

import React, { useImperativeHandle, useReducer, useState, useEffect } from "react";
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



const Navbar = (props) => {
  // webpage path
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  // Al-Taimee - function to toggle hamburger menu on responsive screen
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };


  /* Only shows other paths when a search has been initiated */
  return (
    /*Al-Taimee - show hamburger menu when clicked*/
    <div className={`navigation ${showMenu ? "show-menu" : ""}`}>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776; 
      </div>
      

      <div className={`menu-icon ${props.menuVisible ? "open" : ""}`} onClick={props.onMenuToggle}>
        
      </div>

      <ul className={showMenu ? "show" : ""}>
        <li className={location.pathname === "/" ? "active" : ""}>
          {/*Al-Taimee - Collapse into hamburger and call Link when clicked*/}
        <Link to="/" onClick={() => setShowMenu(false)}>Search</Link>
        </li>
       
       
        {props.visible && (
          <>
            <li className={location.pathname === "/graphs" ? "active" : ""}>
              {/*Al-Taimee - Collapse into hamburger and call Link when clicked*/}
              <Link to="/graphs" onClick={() => setShowMenu(false)}>Toxic Releases</Link>
            </li>
            <li className={location.pathname === "/ephdata" ? "active" : ""}>
              {/*Al-Taimee - Collapse into hamburger and call Link when clicked*/}
              <Link to="/ephdata" onClick={() => setShowMenu(false)}>Health Outcomes</Link>
            </li>
            <li className={location.pathname === "/datacomp" ? "active" : ""}>
              {/*Al-Taimee - Collapse into hamburger and call Link when clicked*/}
              <Link to="/datacomp" onClick={() => setShowMenu(false)}>Data Comparison</Link>
            </li>
            
            
          </>
        )}
                <li className={location.pathname === "/about" ? "active" : ""}>
                  {/*Al-Taimee - Collapse into hamburger and call Link when clicked*/}
          <Link to="/about" onClick={() => setShowMenu(false)}>About</Link>
        </li>
      </ul>
      <div className="logo">
        {/*Al-Taimee - Collapse into hamburger and call Link when clicked*/}
        <Link to="/" onClick={() => setShowMenu(false)}>VETHOS.</Link>
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
  const [menuVisible, setMenuVisible] = useState(false);
  


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
  document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('online', updateOnlineOfflineStatus);
    window.addEventListener('offline', updateOnlineOfflineStatus);

    function updateOnlineOfflineStatus() {
        var onLineOfflineAlert = document.getElementById('onLineOffline-alert');
        //if online, online message
        if (navigator.onLine) {
            onLineOfflineAlert.style.backgroundColor = '#33cc33'; 
            onLineOfflineAlert.innerHTML = '<p>Internet connection is restored!</p>';
        } else {
            //else offline message
            onLineOfflineAlert.style.backgroundColor = '#ff3333'; 
            onLineOfflineAlert.innerHTML = '<p>Please reconnect to the internet</p>';
        } 

        onLineOfflineAlert.style.display = 'block';

        if (navigator.onLine) {
          setTimeout(function () {
            onLineOfflineAlert.style.display = 'none';
        }, 3000); // if online, hide the alert after 3 seconds
        }
        
    }
});

      

      


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
      {/*Al-Taimee - set menu on navbar*/}
      <Navbar visible={!!state.map} onMenuToggle={() => setMenuVisible(!menuVisible)}
        menuVisible={menuVisible}/>

      <div id="onLineOffline-alert">
        <span id="close-alert" onclick="document.getElementById('onLineOffline-alert').style.display='none'">&times;</span>
        <p>Internet connection is restored!</p>
      </div>

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
            <DataComp map={state.map} filters={state.filters} onFilterChange={(filters => dispatch(setFilters(filters)))} />
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