/* DELETE FILE POSSIBLY */ 

import "./index.css";
import React, { useEffect, useState } from "react";
import Filters from "../Filters";
import Title from "../Title";
import PropTypes from "prop-types";
import axios from 'axios';

const vetapi = require("../api/vetapi");
const { years } = require("../contants");


function EPHTable() {
  const [data, setData] = useState([]);

    useEffect(() => {
      const APIurl = 'https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/858/2205/all/all/2/2016,2014,2012,2010,2008,2006,2004,2002,2000/0/0?AnalyteId=25&DemographicId=1,4,5,7,9,10,16&PercentileId=1';

      axios.get(APIurl)
        .then(response => {
          const APIdata = response.data.sampleSizeTableResult.map((item) => ({
          dataValue: item.dataValue,
          concentration: item.Concentration
        }));
        setData(APIdata);
      })
        .catch((error) => {
          console.error("Error trying to retrieve data from EPH API: ", error);
        });
    }, []);

    /* Started getting an error about API having too many requests - AMRITA RESUME LATER */ 
    return (
      <table className="eph-table">
        <thead>
          <tr>
            <th className="sticky-header">Percentile</th>
            <th className="sticky-header">Population Type</th>
            <th className="sticky-header">Concentration</th>
            <th className="sticky-header">Sample Size</th>
            <th className="sticky-header">95% Confidence Interval</th>
          </tr>
        </thead>
        <tbody>
          <tr>
              <th rowspan="7" className="percentile-50" >50th</th>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
          </tr>
          <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <th className="percentile-95" rowspan="7">95th</th>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            <tr>
              <td className=" ">1</td>
              <td className=" ">2</td>
              <td className=" ">3</td>
              <td className=" ">4</td>
            </tr>
            
        </tbody>
      </table>
    );
  };



  export default EPHTable;