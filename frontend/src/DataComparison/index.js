import "./index.css";
import EPHChart from "../EPHCharts";
import NationalEPHCompare from "./nationalEPHCompare.js";
import React, { useState, useEffect } from 'react';
import Title from "../Title";
import GraphContainer from "../GraphView/index.js"; 

import EPHThematicStateMap from "../EPHThematicStateMap";
import PropTypes from "prop-types";
import Filters from "../Filters/index.js";
const geocoder = require("../api/geocoder");
const vetapi = require("../api/vetapi");


const { formatChemical, getLocationString } = require("../helpers");
const { years } = require("../contants");
const { amountAsLabel, formatAmount } = require("../helpers");
//created by Katherine O'Donnell

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

  const timelineAspectRatio = 17 / 9;
  const maxLabelLength = 20;
  const customYAxisTickFormatter = (val) => amountAsLabel(val) + " ";

  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    let { value } = payload;
    if (value.length > maxLabelLength + 5) {
      value = value.slice(0, maxLabelLength + 5) + "...";
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text fontSize="12" transform="rotate(-35)" x={0} y={0} dx={-10}>
          <tspan textAnchor="end" x="0" dy="0">
            {value}
          </tspan>
        </text>
      </g>
    );
  };
  
  class CustomTooltip extends Tooltip {
    static defaultProps = {
      ...Tooltip.defaultProps,
      contentStyle: {
        color: "#FFF",
        background: "rgba(0,0,0,0.8)",
        border: "none",
      },
      itemStyle: { color: "#FFF" },
      labelStyle: { fontSize: "24px", fontWeight: "bold" },
      isAnimationActive: false,
      formatter: (value) => formatAmount(value),
      itemSorter: (a) => -a.value,
    };
  }

  class CustomLine extends Line {
    static defaultProps = {
      ...Line.defaultProps,
      type: "monotone",
      strokeWidth: 3,
      dot: false,
      activeDot: { r: 8 },
    };
  }

  class CustomYAxis extends YAxis {
    static defaultProps = {
      ...YAxis.defaultProps,
      type: "number",
      unit: "lbs",
      width: 100,
      tickFormatter: customYAxisTickFormatter,
    };
  }

  class CustomXAxis extends XAxis {
    static defaultProps = {
      ...XAxis.defaultProps,
      dataKey: "name",
      type: "category",
      interval: 0,
      tick: CustomXAxisTick,
    };
  }
  

  

/* convert properties of graph to query params for the VET api */
const createParams = ({ map, filters }, customParams) => {
  const params = {
    city: map.city,
    county: map.county,
    state: map.state,
    carcinogen: filters.carcinogen,
    pbt: filters.pbt,
    release_type: filters.releaseType,
    chemical: filters.chemical,
    year: filters.year,
  };
  Object.assign(params, customParams);
  return { params };
};


function DataComp(props){
    const [currentMeasure, setMeasure] = useState(null);
    const [chemicals, setChemicals] = React.useState([]);

    /* farzana */
    React.useEffect(() => {
      async function fetchChemicalList(map) {
        const params = {
          city: map.city,
          county: map.county,
          state: map.state,
        };
        try {
          const res = await vetapi.get("/chemicals", { params });
          const tmp = [...new Set(res.data.map((d) => formatChemical(d)).sort())];
          setChemicals(tmp);
        } catch (err) {
          console.log(err);
        }
      }
  
      if (props.map) fetchChemicalList(props.map);
    }, [props.filters, props.map]);

    function handleError(err) {
      console.error(err);
      /* do something here */
    }

    function onFilterChange(event) {
      const target = event.target;
      const filters = { ...props.filters, [target.name]: target.value };
      props.onFilterChange(filters);
 
      TimelineTotal({ map: props.map, filters });
    }
    

    /* Amrita - Timeline changes based on user's selection in drop-down */
    const handleChange = (event) => {
      setMeasure(event.target.value);
  };

/* farzana */
  function getChemicals() {
    let options = [];
    options.push(
      <option defaultValue={true} key="all" value="all">
        All chemicals
      </option>
    );
    if (chemicals.length === 0) return options;
  
    for (var chemical of chemicals) {
      options.push(
        <option key={chemical} value={chemical}>
          {chemical}
        </option>
      );
    }
    return options;
  }
  async function TimelineTotal({ map, filters }) {
    try {
      const res = await vetapi.get(
        `/stats/location/timeline/total`,
        createParams({ map, filters }, { year: null })
      );
      const data = res.data;
      /* Fill total timeline with zeros, only needed if filtering by chemical and there is missing release data for one or more years */
      for (let i = years.start; i <= years.end; i++) {
        if (!data.find((d) => d.year === i)) {
          data.push({
            year: i,
            total: 0,
          });
        }
      }
      data.sort((a, b) => a.year - b.year);
      const body = (
        <div>
          <ResponsiveContainer width="100%" aspect={timelineAspectRatio}>
            <LineChart data={data} margin={{ right: 150 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="year" />
              <CustomYAxis></CustomYAxis>
              <CustomTooltip></CustomTooltip>
              <CustomLine
                name="total (lbs)"
                dataKey="total"
                stroke="#9c27b0"
              ></CustomLine>
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
      return body;
    } catch (err) {
      handleError(err);
      return null;
    }
  }
  
    return(
        <div className="data-comp-container">
            <div className="content-group">
                <div className="comp-header">
                    <h1>Data Comparison</h1>
                </div>
                <div className="data-reps">
                    <div className="tri-data">
                        <h2>Toxicant Release</h2>
                        {/* farzana */}
                        <select
                          name="chemical"
                          value={props.filters.chemical}
                          onChange={onFilterChange}
                          id=""
                        >
                          {getChemicals()}
                        </select>
    

                    </div>
                    <div className="eph-data">
                        {/* Amrita - Adding drop-down menu for public health measures */}
                        <h2>Public Health Data</h2>
                        <select onChange={handleChange} value={currentMeasure}>
                            <option>Choose a public health measure</option>
                            <option>Arsenic in water</option>
                            <option>Asthma in Adults</option>
                            <option>Asthma in Children</option>
                            <option>Asthma Hospitalizations</option>
                            <option>Bisphenol and Paraben in Urine</option>
                            <option>Prevalence of Cancer</option>
                            <option>Childhood Cancer Brain & Central Nervous System</option>
                            <option>Childhood Cancer Leukemia</option>
                            <option>DEPH in Water</option>
                            <option>Fertility Rate</option>
                            <option>Heart Attack</option>
                            <option>Infant Mortality</option>
                            <option>Lead in Blood</option>
                            <option>Low Birthweight</option>
                            <option>Metals in Urine</option>
                            <option>PCE in Water</option>
                            <option>Pesticides in Urine</option>
                            <option>PFAS in Blood</option>
                            <option>PFAS in Water</option>
                            <option>Phthalates in Urine</option>
                            <option>Premature Birth</option>
                            <option>Radium in Water</option>
                            <option>TCE in Water</option>
                            <option>Uranium in Water</option>
                        </select>

                        {/* Amrita - Calls timeline from NationalEPHCompare to display timeline for Public Health Data section */}
                        {currentMeasure === "Lead in Blood" && (<NationalEPHCompare measure={"lead in blood"} units={"Concentration (micrograms/deciliter)"}/>)}
                        {currentMeasure === "Metals in Urine" && ( <NationalEPHCompare measure={"metals in urine"} units={"Concentration (micrograms/gram)"}/> )}
                        {currentMeasure === "Phthalate Metabolites in Urine" && ( <NationalEPHCompare measure={"Phthalate Metabolites in urine (creatinine corrected)"} units={"Concentration (micrograms/gram)"}/> )}
                        {currentMeasure === "Bisphenol and Paraben in Urine" && (<NationalEPHCompare measure={"Bisphenol and paraben in urine"} units={"Concentration (micrograms/gram)"}/>)}
                        {currentMeasure === "PFAS in Blood" && (<NationalEPHCompare measure={"PFAS in blood"} units={"Concentration (micrograms/liter)"}/>)}
                        {currentMeasure === "Pesticides in Urine" && (<NationalEPHCompare measure={"Pesticides in urine"} units={"Concentration (micrograms/gram)"}/>)}

                    </div>
                </div> {/*data reps*/}
            </div>
        </div> //datacomp
    )

}


export default DataComp;