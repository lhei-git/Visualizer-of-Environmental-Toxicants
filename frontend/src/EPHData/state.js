import React, { useEffect, useReducer, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import StateTimeSeries from '../EPHCharts/state';
import StateTable from '../EPHTable/state';
import SimpleMap from '../EPHMapView';
import ChildhoodBrain from '../EPHMapView/ChildhoodBrain';
import ChildhoodLeukemia from '../EPHMapView/ChildhoodCancerLeukemia';
import { getLocationParents } from '../helpers';
import "./state.css";
import  Accordion  from '../Accordion/Accordion';

const StateData = ({ measure, measureID, units }) => {
  const [selectedPercentile, setSelectedPercentile] = useState(
    parseInt(sessionStorage.getItem('currentTab')) || 1
  );
  const [selectedDemographic, setSelectedDemographic] = useState(16);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  function chooseFilters(percentile, demographic) {
    sessionStorage.setItem('selectedPercentile', percentile);
    setSelectedDemographic(demographic);
    setSelectedPercentile(percentile);
  }

  useEffect(() => {
    chooseFilters(1, 16); // Default 50th percentile, US population
  }, []);

  const initialState = {
    map: JSON.parse(sessionStorage.getItem('map')),
    filters: {
      chemical: 'all',
      pbt: false,
      carcinogen: false,
      releaseType: 'all',
      year: 2022,
    },
    errorMessage: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setMap':
        sessionStorage.setItem('map', JSON.stringify(action.payload));
        return {
          ...state,
          map: action.payload,
        };
      case 'setFilters':
        const newFilters = Object.assign({}, action.payload);
        return { ...state, filters: newFilters };
      case 'setErrorMessage':
        return { ...state, errorMessage: action.payload };
      default:
        throw new Error();
    }
  };

  const [state] = useReducer(reducer, initialState);
  const stateName = getLocationParents(state.map, 'stateLong');
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${
    currentDate.getDate()
  }/${currentDate.getFullYear()}`;

 
const accordionMeasure = [

    {
        measureID: 587,
        sections: [
        {
            title: 'What does this data mean',
            content: 'Details about what data means for Asthma',
        },

        {
            title: 'Where did we get this data?',
            content: 'Data are from the Behavior Risk Factor Surveillance Survey (BRFSS), a state-based, random-digit-dial telephone survey of the non-institutionalized, civilian U.S. population 18 years of age and older. BRFSS data are self-reported.',
        }
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
            content: "U.S. Cancer Statistics data are provided by CDC's National Program of Cancer Registries as submitted to CDC and NCI in the most recent data submission.",
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
            content: "U.S. Cancer Statistics data are provided by CDC's National Program of Cancer RegistriePs as submitted to CDC and NCI in the most recent data submission."
        }
    ]
    }, 



]
const currentAccordionMeasure = accordionMeasure.find(
    section => section.measureID === measureID
  );

  return (
    <div className="state-container" ref={containerRef}>
      <h1>{measure} in {stateName}</h1>
      <div className={`time-series`}>
          <StateTimeSeries
            size={{ width: 800, height: 400 }}
            measureID={measureID}
            units={units}
            percentile={1}
            demographic={selectedDemographic}
          />
       
      </div>
      <div className="desc-container">
        <p></p>
      </div>
      <div className={`map-container`}>
        {measureID === 587 && (<SimpleMap map={state.map} />)} {/* asthma == 587 */}
        {measureID === 67 && (<ChildhoodBrain map={state.map} />)} {/* 67 == brain/nerv cancer */}
        {measureID === 71 && (<ChildhoodLeukemia map={state.map} />)} {/* leukemia == 71 */}
      </div>
      <div className={'eph-table-container'}>
        <StateTable measureID={measureID} />
      </div>

      
      {currentAccordionMeasure &&
        currentAccordionMeasure.sections.map(section => (
          <Accordion key={section.title} title={section.title} content={section.content} />
        ))}
    
    </div>
    
  );
};

StateData.propTypes = {
  measure: PropTypes.string.isRequired,
  measureID: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
};

export default StateData;
