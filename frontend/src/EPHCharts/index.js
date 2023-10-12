import React from 'react'
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';

const EPHChart = ({size}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = 'https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/858/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=25&DemographicId=16&PercentileId=1';

    axios.get(url)
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
  }, []);

  return (
    <div className="TimeSeries" style={{width: size.width, height: size.height }}>
      <TimeSeries data={data} size={size} />
    </div>
  );

  }

  EPHChart.propTypes = {
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  };

  function TimeSeries({ data, size }) {
    
    return (
      <LineChart width={size.width} height={size.height} data={data}>
        <CartesianGrid />
        <XAxis dataKey="year" />
        <YAxis>
          <Label 
            style={{textAnchor: "middle"}}
            angle={270} 
            position='insideLeft'
            value={"Concentration (micrograms/deciliter)"}
            margin={200}/>

        </YAxis>
        <Tooltip />
        <Line name="Concentration" type="monotone" dataKey="dataValue" stroke="purple" />
      
      </LineChart>
    );
  }

  TimeSeries.propTypes = {
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  };
  
  
export default EPHChart;