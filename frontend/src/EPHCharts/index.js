import React from 'react'
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';

function EPHChart() {
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
    <div className="TimeSeries">
      <TimeSeries data={data} />
    </div>
  );

  }

  function TimeSeries({ data }) {
    
    return (
      <LineChart width={800} height={400} margin={100}data={data}>
        <CartesianGrid />
        <XAxis dataKey="year" />
        <YAxis>
          <Label 
            style={{textAnchor: "middle"}}
            angle={270} 
            position='insideLeft'
            value={"Concentration (micrograms/deciliter)"}/>

        </YAxis>
        <Tooltip />
        <Line name="Concentration" type="monotone" dataKey="dataValue" stroke="purple" />
      
      </LineChart>
    );
  }
  
  
export default EPHChart;