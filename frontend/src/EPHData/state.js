import React, { useEffect, useReducer, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import StateTimeSeries from '../EPHCharts/state';
import StateTable from '../EPHTable/state';
import StateMap from '../EPHMapView';
import Accordion from '../Accordion/Accordion';
import FadeInSection from '../FadeInSection';
import { getLocationParents } from '../helpers';

import './index.css';
import './state.css';

const StateData = ({ measure, measureID, units }) => {
  const [selectedPercentile, setSelectedPercentile] = useState(
    parseInt(sessionStorage.getItem('currentTab')) || 1
  );
  const [selectedDemographic, setSelectedDemographic] = useState(16);
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


  function getSubtitle(subtitle) {
    if(measureID === 587) {
      return subtitle = "Crude Prevalence of Children <=17 Years of Age Ever Diagnosed with Asthma"
    }
    else if (measureID === 67) {
      return subtitle = "Annual Number of Cases of Brain and Central Nervous System Cancer among Children <20 Years of Age"
    }
    else if (measureID === 71) {
      return subtitle = "Annual Number of Leukemia among Children <20 Years of Age"
    }
  }
  const accordionMeasure = [
    {
      measureID: 587,
      sections: [
        {
          title: 'Where did we get this data?',
          content: 'https://ephtracking.cdc.gov/DataExplorer/  Citation: Centers for Disease Control and Prevention. Environmental Public Health Tracking Network. Asthma Prevalence among Children.',
        },
        {
          title: 'Where did CDC get this data?',
          content: "Data are from the Behavior Risk Factor Surveillance Survey (BRFSS), a state-based, random-digit-dial telephone survey of the non-institutionalized, civilian U.S. population 18 years of age and older. BRFSS data are self-reported.",
        },
      ],
    },
    {
      measureID: 67,
      sections: [
        {
          title: 'Where did we get this data?',
          content: "https://ephtracking.cdc.gov/DataExplorer/   Citation: Centers for Disease Control and Prevention, National Program of Cancer Registries and National Cancer Institute, Surveillance Epidemiology and End Results Program. Childhood Cancer Incidence.",
        },
        {
          title: "Where did CDC get this data?",
          content: " U.S. Cancer Statistics data are provided by CDC's National Program of Cancer Registries as submitted to CDC and NCI in the most recent data submission.",
        },
      ],
    },
    {
      measureID: 71,
      sections: [
        {
          title: "Where did we get this data from?",
          content: "https://ephtracking.cdc.gov/DataExplorer/ Citation: Centers for Disease Control and Prevention, National Program of Cancer Registries and National Cancer Institute, Surveillance Epidemiology and End Results Program. Childhood Cancer Incidence. ",
        },
        {
          title: "Where did the CDC get this data from?",
          content: "U.S. Cancer Statistics data are provided by CDC's National Program of Cancer RegistriePs as submitted to CDC and NCI in the most recent data submission.",
        },
      ],
    },
  ];

  const currentAccordionMeasure = accordionMeasure.find(
    section => section.measureID === measureID
  );

  return (
    <FadeInSection>
      <div className="state-container" ref={containerRef}>
        <FadeInSection>
          <div className='state-header'>
          <h1>{measure} in {stateName}</h1>
          <h3>{getSubtitle()}</h3>
          </div>
        </FadeInSection>

        <div className={`time-series`}>
          <FadeInSection>
            <StateTimeSeries
              size={{ width: 800, height: 400 }}
              measureID={measureID}
              units={units}
              percentile={1}
              demographic={selectedDemographic}
            />
          </FadeInSection>
        </div>


          <FadeInSection>        
          <div className={`map-container`}>
            {measureID === 587 && (<StateMap yearRange={[2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011]} measure={"Asthma in Children"} />)}
            {measureID === 67 && (<StateMap yearRange={[2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001]} measure={"Childhood Brain and Nervous System Cancer"} />)}
            {measureID === 71 && (<StateMap yearRange={[2020,2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001]} measure={"Childhood Cancer Leukemia"} />)}
          </div>
          </FadeInSection>

        <FadeInSection>
          <div className={'eph-table-container'}>
            <StateTable measureID={measureID} units={units} />
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
};

StateData.propTypes = {
  measure: PropTypes.string.isRequired,
  measureID: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
};

export default StateData;
