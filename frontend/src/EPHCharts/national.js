import React from 'react'
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';

/* NOTES:
indicator for all ntnl measures: National report on human exposure to environmental chemicals
Content area for all ntnl measures: Biomonitoring: Population exposure
*/

//written by Katherine O'Donnell

const NationalTimeSeries = ({size, measure, units, percentile, demographic}) => {
  const [data, setData] = useState([]);
  const apiURL = getApiURL(measure);    //api endpoint selected based on measure

  useEffect(() => {

    axios.get(apiURL)
      .then((response) => {
        const newData = response.data.sampleSizeTableResult.map((item) => ({
          year: item.year,
          dataValue: item.dataValue,
        }));
        setData(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [apiURL]);

  function getApiURL(selectedMeasure){
    if (selectedMeasure === "lead in blood") {
        //us population, ug/dL
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/858/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=25&DemographicId=${demographic}&PercentileId=${percentile}`;
    } else if (selectedMeasure === "metals in urine") {
        //analyte: total arsenic, 50th percentile, us population, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/856/2205/all/all/2/2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=3&DemographicId=${demographic}&PercentileId=${percentile}`;
    } else if (selectedMeasure === "Phthalate Metabolites in urine (creatinine corrected)"){
        //analyte: MBzP, 50th percentile, us population, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/863/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=44&DemographicId=${demographic}&PercentileId=${percentile}`;
    } else if (selectedMeasure === "Bisphenol and paraben in urine"){
        //measure Personal care and consumer products metabolities in urine (creatinine corrected)
        //analyte: BPA, 50th %ile, nat population, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/859/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004/0/0?AnalyteId=43&DemographicId=${demographic}&PercentileId=${percentile}`;
    } else if (selectedMeasure === "PFAS in blood"){
        //analyte: PFOS, 50h %ile, nat pop, ug/L
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/826/2205/all/all/2/2018,2016,2014,2012,2010,2008,2006,2004,2000/0/0?AnalyteId=27&DemographicId=${demographic}&PercentileId=${percentile}`;
    } else if (selectedMeasure === "Pesticides in urine"){
        //Pesticide Metabolites: Pyrethroid metabolities in urine (creatinine corrected) ADD DIFF MEASURE FILTERS
        //analyte: OPM, 50th %ile, nat pop, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/861/2205/all/all/2/2014,2012,2010,2008,2002,2000/0/0?AnalyteId=34&DemographicId=${demographic}&PercentileId=${percentile}`;
    } else {
        // error handling????
        return '';
    }
  }

  return (
    <div className="TimeSeries" style={{width: size.width, height: size.height }}>
      <TimeSeries data={data} size={size} units={units}/>
    </div>
  );
}

  NationalTimeSeries.propTypes = {
    size: PropTypes.shape({                     //size of chart to be displayed
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    measure: PropTypes.string.isRequired,       //measure selected on eph page
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
    //lineName: PropTypes.string.isRequired,      //type of measure (e.g. concentration) selected on eph page
    percentile: PropTypes.number.isRequired,         //1=50th, 2=95th
    demographic: PropTypes.number.isRequired,         //16=US pop 10=male 

  };

  function TimeSeries({ data, size, units }) {
    
    return (
      <LineChart width={size.width} height={size.height} data={data}>
        <CartesianGrid />
        <XAxis dataKey="year" />
        <YAxis>
          <Label 
            style={{textAnchor: "middle"}}
            angle={270} 
            position='insideLeft'
            value={units}
            margin={200}/>
        </YAxis>
        <Tooltip />
        <Line name="Concentration" type="monotone" dataKey="dataValue" stroke="purple" />
      </LineChart>
    );
  }

  TimeSeries.propTypes = {
    size: PropTypes.shape({                     //same size prop as chart
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
  };

export default NationalTimeSeries;