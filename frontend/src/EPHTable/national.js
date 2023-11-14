/* DELETE FILE POSSIBLY */ 

import "./national.css";
import React, { useEffect, useState } from "react";
import axios from "axios";



function NationalTable({ measure }) {
  const [data, setData] = useState([]);

  //get API URL based on measure
  function getApiURL(selectedMeasure){
    if (selectedMeasure === "Lead in Blood") {
        //us population, ug/dL
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/858/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=25&DemographicId=16&PercentileId=1`;
    } else if (selectedMeasure === "Metals in Urine") {
        //analyte: total arsenic, 50th percentile, us population, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/856/2205/all/all/2/2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=3&DemographicId=16&PercentileId=1`;
    } else if (selectedMeasure === "Phthalate Metabolites in Urine (creatinine corrected)"){
        //analyte: MBzP, 50th percentile, us population, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/863/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=44&DemographicId=16&PercentileId=1`;
    } else if (selectedMeasure === "Bisphenol and Paraben in Urine"){
        //measure Personal care and consumer products metabolities in urine (creatinine corrected)
        //analyte: BPA, 50th %ile, nat population, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/859/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004/0/0?AnalyteId=43&DemographicId=16&PercentileId=1`;
    } else if (selectedMeasure === "PFAS in Blood"){
        //analyte: PFOS, 50h %ile, nat pop, ug/L
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/826/2205/all/all/2/2018,2016,2014,2012,2010,2008,2006,2004,2000/0/0?AnalyteId=27&DemographicId=16&PercentileId=1`;
    } else if (selectedMeasure === "Pesticides in Urine"){
        //Pesticide Metabolites: Pyrethroid metabolities in urine (creatinine corrected) ADD DIFF MEASURE FILTERS
        //analyte: OPM, 50th %ile, nat pop, ug/g
        return `https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/861/2205/all/all/2/2014,2012,2010,2008,2002,2000/0/0?AnalyteId=34&DemographicId=16&PercentileId=1`;
    } else {
        // error handling????
        return '';
    }
  }

  const url = getApiURL(measure);
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const APIdata = response.data.sampleSizeTableResult.map((item) => ({
          dataValue: item.dataValue,
          sampleSize: item.sampleSize,
          concentration: item.Concentration,
          year: item.year
        }));
        setData(APIdata);
      })
      .catch((error) => {
        console.error("Error trying to retrieve data from EPH API: ", error);
      });
  }, [url]);

  return (
    <table className="eph-table">
      <thead>
        <tr> 
          
          <th className="sticky-header">Year</th>
          <th className="sticky-header">Concentration</th>
          <th className="sticky-header">Sample Size</th>
          
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.year}</td>
            <td>{item.dataValue}</td>
            <td>{item.sampleSize}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export default NationalTable;
