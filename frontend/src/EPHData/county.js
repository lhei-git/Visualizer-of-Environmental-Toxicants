//blueprint to display state data
//created by Katherine O'Donnell, added map code from Farzana Israt & table code from Taimee Hassan
import "./index.css";
import "./county.css";
import CountyTimeSeries from "../EPHCharts/county";
import CountyTimeSeriesWater from "../EPHCharts/countyWater";
import CountyTable from "../EPHTable/county";
import {useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import EPHThematicStateMap from "../EPHThematicStateMap";
import Accordion from "../Accordion/Accordion";
import EPHThematicWaterStateMap from "../EPHThematicStateView(Water)";
import FadeInSection from "../FadeInSection";
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
    const countyName = getLocationParents(state.map, "county");
    const stateLong = getLocationParents(state.map, "stateLong");

    //create date object to be used in data citation - shows that the app pulls from the EPH API the day the user is accessing the site
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    const accordionMeasure = [

        {
            measureID: 1120,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Asthma Prevalence among Children.',
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
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Hospitalizations for Asthma.',
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
                content: `https://ephtracking.cdc.gov/DataExplorer/ Citation: Accessed From: https://ephtracking.cdc.gov/DataExplorer. Accessed on ${formattedDate}`,
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
                title: 'What does this data mean?',
                content: 'The Total Fertility Rate (TFR) estimates the number of births that a hypothetical group of 1,000 women would have over their lifetimes, based on age-specific birth rates in a given year.',
            },
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. National Center for Health Statistics. Reproductive and Birth Outcomes.',
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
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Mortality for Heart Attack.',
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
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. National Center for Health Statistics. Reproductive and Birth Outcomes.',
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
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. National Center for Health Statistics. Reproductive and Birth Outcomes.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Natality data and period linked birth-infant death data are provided by CDC's National Center for Health Statistics (NCHS) National Vital Statistics System. Population estimates are from the Vintage Bridged-Race Population Estimates as of July 1, 20XX (please check the latest updated population data)."
            }
        ]
        }, 
        {
            measureID: 30,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. National Center for Health Statistics. Reproductive and Birth Outcomes.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Natality data and period linked birth-infant death data are provided by CDC's National Center for Health Statistics (NCHS) National Vital Statistics System. Population estimates are from the Vintage Bridged-Race Population Estimates as of July 1, 20XX (please check the latest updated population data)."
            }
        ]
        }, 

        {
            measureID: 769,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Health Tracking Network. Arsenic in Community Water Systems.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data provided by state and local Environmental Health Tracking Programs. Data are derived from state databases associated with Safe Drinking Water Act. States without data shown here may have data available through their state databases for drinking water."
            }
        ]
        }, 

        {
            measureID: 802,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Community Drinking Water.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data provided by state and local Environmental Health Tracking Programs. Data are derived from state databases associated with Safe Drinking Water Act. States without data shown here may have data available through their state databases for drinking water."
            }
        ]
        }, 
        {
            measureID: 807,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Community Drinking Water.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data provided by state and local Environmental Health Tracking Programs. Data are derived from state databases associated with Safe Drinking Water Act. States without data shown here may have data available through their state databases for drinking water."
            }
        ]
        }, 
        {
            measureID: 734,
            sections: [
            {
                title: 'Where did we get this data?',
                content: `Accessed From: https://ephtracking.cdc.gov/DataExplorer. Accessed on ${formattedDate}`,
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data for PFAS concentrations in drinking water for selected community water systems (CWS) were obtained from EPA's National Contaminant Occurrence Database (https://www.epa.gov/dwstandardsregulations/national-contaminant-occurrence-database-ncod#unreg) for the third Unregulated Contaminant Monitoring Rule (UCMR 3). A summary of the UCMR 3 data and analytical results is available here: https://www.epa.gov/sites/production/files/2017-02/documents/ucmr3-data-summary-january-2017.pdf."
            }
        ]
        }, 
        {
            measureID: 817,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Community Drinking Water.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data provided by state and local Environmental Health Tracking Programs. Data are derived from state databases associated with Safe Drinking Water Act. States without data shown here may have data available through their state databases for drinking water."
            }
        ]
        },
        {
            measureID: 812,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Community Drinking Water.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data provided by state and local Environmental Health Tracking Programs. Data are derived from state databases associated with Safe Drinking Water Act. States without data shown here may have data available through their state databases for drinking water."
            }
        ]
        },  
        {
            measureID: 822,
            sections: [
            {
                title: 'Where did we get this data?',
                content: 'https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Community Drinking Water.',
            },
            {
                title: 'Where did CDC get this data from?',
                content: "Data provided by state and local Environmental Health Tracking Programs. Data are derived from state databases associated with Safe Drinking Water Act. States without data shown here may have data available through their state databases for drinking water."
            }
        ]
        }, 
    
    
    ]
    const currentAccordionMeasure = accordionMeasure.find(
        section => section.measureID === measureID
      );


      
    /*generate different county data pages water & non water measures  
    no time series graphs exist for water measures, so if the measure ID is in waterMeasureIDs, 
    the time series graph and relevant header will be hidden*/

    //arsenic: 769 deph: 802 pce: 807 pfas:734 radium: 817 tce: 812 uranium: 822
    const waterMeasureIDs = [769, 802, 807, 734, 817, 812, 822];
    
    //.jsx layout
    return(
        <FadeInSection>
        <div className="county-container">
        <FadeInSection>
        {(!waterMeasureIDs.includes(measureID) && countyName != null) && (
                <h1>{measure} in {countyName} County, {stateAbbr}</h1>
        )}                  
        </FadeInSection>
            {/*change time series info based on filter changes*/}
            <div className = "time-series">

            <FadeInSection>
                {!waterMeasureIDs.includes(measureID) && (
                    <CountyTimeSeries
                    size={{ width: 800, height: 400 }}
                    measureID={measureID}
                    units={units}
                    percentile={1} 
                    demographic={selectedDemographic}
                />
                )}                
            </FadeInSection>
            </div>
            
            <div className = "map-container">
                {measureID === 769 && (
                    <EPHThematicWaterStateMap 
                    yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                    level={[1, 2, 3]}
                    measure={"Arsenic in Community Water"}
                    stateName={stateAbbr}
                    stateLongName={stateLong}>
                    </EPHThematicWaterStateMap> )}

                    {/*asthma*/}
                {measureID === 1120 && (
                    <EPHThematicStateMap 
                    yearRange={[2020, 2019, 2018]}
                    measure={"Asthma Among Adults"}
                    stateName={stateAbbr}
                    stateLongName={stateLong}>
                    </EPHThematicStateMap> )}

                 {/*cancer*/}
                 {measureID === 1095 && (
                    <EPHThematicStateMap 
                    yearRange={[2020, 2019, 2018]}
                    measure={"Prevalence of Cancer"}
                    stateName={stateAbbr}
                    stateLongName={stateLong}>
                    </EPHThematicStateMap> )}

                 {/*fertility*/}
                 {measureID === 45 && (
                    <EPHThematicStateMap 
                    yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                    measure={"Fertility Rate"}
                    stateName={stateAbbr}
                    stateLongName={stateLong}>
                    </EPHThematicStateMap> )}

                 {/*heart*/}
                 {measureID === 553 && (
                    <EPHThematicStateMap 
                        yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                        gender={[1, 2]}
                        measure={"Heart Attack"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                    </EPHThematicStateMap> )}

                 {/*infant mort*/}
                 {measureID === 279 && (
                    <EPHThematicStateMap 
                        yearRange={[2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004]}
                        measure={"Infant Mortality"}
                        stateName={stateAbbr}
                    stateLongName={stateLong}>
                    </EPHThematicStateMap> )}

                 {/*low birth*/}
                 {measureID === 36 && (
                    <EPHThematicStateMap 
                        yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                        gender={[1, 2]}
                        measure={"Low Birthweight"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                    </EPHThematicStateMap> )}

                 {/*pce*/}
                 {measureID === 807 && (
                    <EPHThematicWaterStateMap 
                        yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                        level={[1, 2, 3]}
                        measure={"PCE in Community Water"}
                        stateName={stateAbbr}
                    stateLongName={stateLong}>
                    </EPHThematicWaterStateMap> )}
                    
                 {/*pfas*/}
                 {measureID === 734 && (
                    <EPHThematicWaterStateMap 
                        yearRange={[2015]}
                        contaminant={[1, 2, 3, 4, 5, 6]}
                        measure={"PFAS in Community Water"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                    </EPHThematicWaterStateMap> )}

                {/**/}
                {measureID === 30 && ( 
                <EPHThematicStateMap 
                        yearRange={[ 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]}
                        gender={[1, 2]}
                        measure={"Prematurity"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                </EPHThematicStateMap> )}

                 {/**/}
                {measureID === 817 && ( 
                <EPHThematicWaterStateMap 
                        yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                        level={[1, 2, 3]}
                        measure={"Radium in Community Water"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                </EPHThematicWaterStateMap> )}

                 {/**/}
                {measureID === 812 && ( 
                <EPHThematicWaterStateMap 
                        yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                        level={[1, 2, 3]}
                        measure={"TCE in Community Water"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                </EPHThematicWaterStateMap> )}

                 {/**/}
                {measureID === 822 && ( 
                <EPHThematicWaterStateMap 
                        yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                        level={[1, 2, 3]}
                        measure={"Uranium in Community Water"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                </EPHThematicWaterStateMap> )}

                 {/**/}
                {measureID === 99 && ( 
                /*farzana -- making state maps for each measure*/
                <EPHThematicStateMap 
                        yearRange={[2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014]}
                        measure={"Hospitalizations from Asthma"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                </EPHThematicStateMap> )}
            
                 {/**/}
                {measureID === 802 && (
                <EPHThematicWaterStateMap 
                        yearRange={[2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999]}
                        level={[1, 2, 3]}
                        measure={"DEPH in Community Water"}
                        stateName={stateAbbr}
                        stateLongName={stateLong}>
                </EPHThematicWaterStateMap>)}

            </div>
            
            <FadeInSection>
            <div className="eph-table-container">
            {!waterMeasureIDs.includes(measureID) && (
                    <CountyTable measureID={measureID} units={units} />
                )}   
                
            </div>
            </FadeInSection>
            {currentAccordionMeasure &&
        currentAccordionMeasure.sections.map(section => (
            <FadeInSection key={section.title}>
          <Accordion key={section.title} title={section.title} content={section.content} />
          </FadeInSection>
        ))}
    
        </div>
        </FadeInSection>
    );
}

CountyData.propTypes = {
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    measureID: PropTypes.number.isRequired,       //ID of measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
};





export default CountyData;