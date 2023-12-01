//blueprint to display state data
//created by Katherine O'Donnell, added map code from Farzana Israt & table code from Taimee Hassan
import "./index.css";
import "./county.css";
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
            measureID: 1038,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Asthma Prevalence among Children.',
            },  
            {
                title: 'Where did the CDC get this data?',
                content: 'Data are from the Population Level Analysis and Community Estimates (PLACES) Project (https://www.cdc.gov/places/index.html), which is an expansion of the original 500 Cities Project. The original project was launched by the Centers for Disease Control and Prevention (CDC) in partnerships with the Robert Wood Johnson Foundation (RWJF) and CDC Foundation.',
            },

        ]
    
        }, 
        {
            measureID: 99, 
            sections: [
            
            {
                title: 'Where did we get this data?',
                content: 'Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Hospitalizations for Asthma.',
            },
    
            {
                title: 'Where did CDC get this data from?',
                content: 'The hospital data shown here are provided by state and/or local public health departments to the National Environmental Public Health Tracking Program. Data are based on the date of admission rather than the date of discharge.',
            },

        ]
        
        }, 
        {
            measureID: 1095,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Accessed From: https://ephtracking.cdc.gov/DataExplorer. Accessed on 12/01/2023',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data are from the Population Level Analysis and Community Estimates (PLACES) Project (https://www.cdc.gov/places/index.html), which is an expansion of the original 500 Cities Project. The original project was launched by the Centers for Disease Control and Prevention (CDC) in partnerships with the Robert Wood Johnson Foundation (RWJF) and CDC Foundation."
            }
        ]
        }, 

        {
            measureID: 45,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Centers for Disease Control and Prevention. National Center for Health Statistics. Reproductive and Birth Outcomes.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Natality data and period linked birth-infant death data are provided by CDC's National Center for Health Statistics (NCHS) National Vital Statistics System. Population estimates are from the Vintage Bridged-Race Population Estimates as of July 1, 20XX (please check the latest updated population data)."
            }
        ]
        }, 

        {
            measureID: 553,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Mortality for Heart Attack.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Mortality data from the National Vital Statistics System from National Center for Health Statistics (NCHS). Website source http://www.cdc.gov/nchs/deaths.htm Population data from the National Center for Health Statistics; intercensal estimates were used for 2000-2009; Postcensal estimates were used for 2010 - forward. Website source: http://www.cdc.gov/nchs/nvss/bridged_race.htm"
            }
        ]
        }, 

        {
            measureID: 279,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Centers for Disease Control and Prevention. National Center for Health Statistics. Reproductive and Birth Outcomes.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Natality data and period linked birth-infant death data are provided by CDC's National Center for Health Statistics (NCHS) National Vital Statistics System. Population estimates are from the Vintage Bridged-Race Population Estimates as of July 1, 20XX (please check the latest updated population data)."
            }
        ]
        }, 

        {
            measureID: 36,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Centers for Disease Control and Prevention. National Center for Health Statistics. Reproductive and Birth Outcomes.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for Low Birthweight"
            }
        ]
        }, 
        {
            measureID: 30,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for Prematurity',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for Prematurity"
            }
        ]
        }, 

        {
            measureID: 769,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for Arsenic in Water',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for Arsenic in Water"
            }
        ]
        }, 

        {
            measureID: 802,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for DEPH in water',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for DEPH in water"
            }
        ]
        }, 
        {
            measureID: 807,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for PCE in water',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for PCE in water"
            }
        ]
        }, 
        {
            measureID: 734,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for PFAS in water',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for PFAS in water"
            }
        ]
        }, 
        {
            measureID: 817,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for Radium in Water',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for Radium in water"
            }
        ]
        },
        {
            measureID: 812,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for TCE in water',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for TCE in water"
            }
        ]
        },  
        {
            measureID: 822,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'Details about what data means for Uranium in Water',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Where we got this data from for Uranium in water"
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
                <CountyTimeSeries
                size={{ width: 800, height: 400 }}
                measureID={measureID}
                units={units}
                percentile={1} 
                demographic={selectedDemographic}
                />
            </div>
            
            <div className = "map-container">
            {measureID === 1038 && (
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