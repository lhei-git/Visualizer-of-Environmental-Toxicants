//blueprint to display state data
//created by Katherine O'Donnell, added map code from Farzana Israt & table code from Taimee Hassan
import "./index.css";
import "./county.css"
import CountyTimeSeries from "../EPHCharts/county";
import CountyTable from "../EPHTable/county";
import {useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import SimpleMap from "../EPHMapView";
import ChildhoodBrain from "../EPHMapView/ChildhoodBrain";
import ChildhoodLeukemia from "../EPHMapView/ChildhoodCancerLeukemia";
import EPHThematicStateMap from "../EPHThematicStateMap";
import Accordion from "../Accordion/Accordion";
const React = require("react");
const {getLocationParents, getYearString} = require("../helpers");




//calling County Data on the eph page will generate a data layout for any measure selected
const CountyData = ({measure, measureID, units}) => {
//this section of code handles filter changes
    const [selectedPercentile, setSelectedPercentile] = React.useState(
        parseInt(sessionStorage.getItem("currentTab")) || 1
    );
    const [selectedDemographic, setSelectedDemographic] = React.useState(
        16 // Set an initial value for demographic filter
      );
    function chooseFilters(percentile, demographic) {
        sessionStorage.setItem("selectedPercentile", percentile);
        setSelectedDemographic(demographic);
        setSelectedPercentile(percentile);
    }
    useEffect(() => {
        chooseFilters(1, 16); //default 50th percentile, us population
      }, []); // empty dependency array so effect runs only once
    //below code pulls searched location from app session storage/
    // Initial state of app 
    const initialState = {
        map: JSON.parse(sessionStorage.getItem("map")),
        filters: {
        chemical: "all",
        pbt: false,
        carcinogen: false,
        releaseType: "all",
        //sets initial state to latest year/
        year: 2022,
        },
        errorMessage: "",
    };
    const reducer = (state, action) => {
        switch (action.type) {
            case "setMap":
            // Store latest searched location in session /
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
    const [state] = useReducer(reducer, initialState);
    //end of storage retrieval code

    //get name of searched state from session storage
    const stateAbbr = getLocationParents(state.map, "state");
    const countyName = getLocationParents(state.map, "county") + " County";
    const stateLong = getLocationParents(state.map, "stateLong");

    //create date object to be used in data citation - shows that the app pulls from the EPH API the day the user is accessing the site
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    const accordionMeasure = [

        {
            measureID: 1120,
            sections: [
            {
                title: 'What does this data mean',
                content: 'Details about what data means for Asthma',
            },
    
            {
                title: 'Where did we get this data?',
                content: 'Where we got this data for Asthma',
            },

            {
                title: 'How is this data measured',
                content: 'How the  for Asthma',
            },

        ]
    
        }, 
        {
            measureID: 67, 
            sections: [
            
            {
                title: 'What does this data mean?',
                content: 'Details about what data means for Childhood Brain Cancer',
            },
    
            {
                title: 'Where did we get this data?',
                content: 'Where we got this data for Brain Cancer',
            }
        ]
        
        }, 
        {
            measureID: 71,
            sections: [
            {
                title: 'What does this data mean',
                content: 'Details about what data means for Childhood Leukemia',
            },
            {
                title: "Where is this data from?",
                content: "Where we got this data from for Childhood Leukemia"
            }
        ]
        }, 
    
    
    
    ]
    const currentAccordionMeasure = accordionMeasure.find(
        section => section.measureID === measureID
      );

    //.jsx layout
    return(
        <div className="county-container">
            <h1>{measure} in {countyName}, {stateAbbr}</h1>
            {/*change time series info based on filter changes*/}
            <div className = "time-series">
                {selectedPercentile === 1 && (
                    <CountyTimeSeries
                    size={{ width: 800, height: 400 }}
                    measureID={measureID}
                    units={units}
                    percentile={1}
                    demographic={selectedDemographic}
                    />
                )}
                {selectedPercentile === 2 && (
                    <CountyTimeSeries
                    size={{ width: 800, height: 400 }}
                    measureID={measureID}
                    units={units}
                    percentile={2}
                    demographic={selectedDemographic}
                    />
                )}
            </div>
            
            <div className = "map-container">
            {measureID === 1120 && (
                    <EPHThematicStateMap 
                    yearRange={[2020, 2019, 2018]}
                    measure={"Asthma Among Adults"}
                    stateName={stateAbbr}
                    stateLongName={stateLong}>
                    </EPHThematicStateMap> )}
            </div>
            <div className="eph-table-container">
                <CountyTable measureID={measureID} />
            </div>
            {currentAccordionMeasure &&
        currentAccordionMeasure.sections.map(section => (
          <Accordion key={section.title} title={section.title} content={section.content} />
        ))}
    
        </div>
    );
}

CountyData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    measureID: PropTypes.number.isRequired,       //ID of measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
};





export default CountyData;