/* DELETE FILE POSSIBLY */ 

import "./index.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function EPHTable({ url }) {
  const [data, setData] = useState([]);

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

export default EPHTable;
