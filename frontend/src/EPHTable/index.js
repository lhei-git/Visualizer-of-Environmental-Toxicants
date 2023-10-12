import "./index.css";
import React, { useEffect, useState } from "react";
import Filters from "../Filters";
import Title from "../Title";
import MapView from "../MapView";
import PropTypes from "prop-types";
const vetapi = require("../api/vetapi");
const { amountAsLabel, formatAmount } = require("../helpers");
const { years } = require("../contants");

const {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
} = require("recharts");


function EPHTable() {
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
              <td className="percentile-95">50th</td>
              <td className=" "></td>
              <td className=" "></td>
              <td className=" "></td>
              <td className=" "></td>
            </tr>
            <tr>
              <td className="percentile-95">95th</td>
              <td className=" "></td>
              <td className=" "></td>
              <td className=" "></td>
              <td className=" "></td>
            </tr>
        </tbody>
      </table>
    );
  };

  export default EPHTable;