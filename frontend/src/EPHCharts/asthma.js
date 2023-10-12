import React from 'react'
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import axios from 'axios';

function AsthmaChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const asthma = 'https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/1120/2/all/all/1/2020,2019,2018/0/0';
     axios.get(asthma)
     .then((response) => {
       const newAsthmaData = response.data.tableResult.map((item) => ({
         year: item.year,
         dataValue: item.dataValue,
       }));
       setData(newAsthmaData);
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
      <LineChart width={800} height={400} data={data}>
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
  
  
export default AsthmaChart;