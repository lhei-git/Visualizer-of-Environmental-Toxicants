//created by katie
import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import "./timeseries.css";

const TimeSeries = ({ data, size, units }) => {
    const chartContainer = useRef(null);        //get size of container
    const [sizeDynamic, setSize] = useState({ width: 0, height: 0 }); //initalize size var for time series size
    const [yAxisDomain, setYAxisDomain] = useState([0, 100]); // initialize y axis domain

    
/* Amrita - Customize Line and Tooltip to matching TRI timelines */
class CustomLine extends Line {
  static defaultProps = {
    ...Line.defaultProps,
    type: "monotone",
    strokeWidth: 3,
    dot: false,
    activeDot: { r: 8 },
  };
}

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
  };
}
    
//katie: made timelines responsive
    useEffect(() => {
        const updateDimensions = () => {
          if (chartContainer.current) {
            const containerWidth = chartContainer.current.clientWidth;
            const containerHeight = chartContainer.current.clientHeight;
            const padding = 20;
            const calculatedWidth = containerWidth - 50;
            const calculatedHeight = containerHeight - padding;
    
            // set size dynamically
            setSize({ width: calculatedWidth, height: calculatedHeight });
          }
        };
    
        updateDimensions();
    
        //update size if window is resized
        window.addEventListener('resize', updateDimensions);
    
        //cleanup listener
        return () => {
          window.removeEventListener('resize', updateDimensions);
        };
      }, []);

      useEffect(() => {
        const dataValues = data.map(item => parseFloat(item.dataValue)); // convert dataValue to numbers to be read
        //get min and max, then pass to y axis domain variable
        const minValue = Math.min(...dataValues);
        const maxValue = Math.max(...dataValues) + 5; //set upper bumper
        if (minValue < 5) {
          setYAxisDomain([Math.floor(minValue), Math.ceil(maxValue)]);
        } else {
          setYAxisDomain([Math.floor(minValue) - 5, Math.ceil(maxValue)]); //set bottom bumper
        }
      }, [data]); //'data' in dependency array makes use effect run whenever data set changes
    
      //if the unit label is too long to fit on one line, split into two strings
      function splitUnits(inputUnits) {
        if (inputUnits.length <= 36) { //check length
          return { units1: inputUnits, units2: null };
        } else {
          const lastSpaceIndex = inputUnits.lastIndexOf(' ', 36); //ensure that string gets split at a space, not the middle of a word
          const units1 = inputUnits.substring(0, lastSpaceIndex);
          const units2 = inputUnits.substring(lastSpaceIndex + 1);
      
          return { units1, units2 };
        }
      }
      const newUnits = splitUnits(units)

      //return .jsx layout of time series
    return (
    <div ref={chartContainer} className='time-series-container'>
       
      <LineChart width={sizeDynamic.width} height={sizeDynamic.height} data={data} margin={{left:50, right:70}}>
      <CartesianGrid vertical={false} />
        <XAxis dataKey="year" />
        <YAxis domain={yAxisDomain}>
          <Label
            style={{ textAnchor: 'middle', whiteSpace: 'pre-line' }}
            angle={270}
            position="insideLeft"
            value={newUnits.units1}
            dx={-30} 
            
          />
          <Label
            style={{ textAnchor: 'middle', whiteSpace: 'pre-line' }}
            angle={270}
            position="insideLeft"
            value={newUnits.units2}
            dx={-10} 
         
          />
        </YAxis>
        <CustomTooltip></CustomTooltip>
        <CustomLine name={units} type="monotone" dataKey="dataValue" stroke="#9c27b0" />
      </LineChart>
    </div>
    );
  }
  
  TimeSeries.propTypes = {
    size: PropTypes.shape({                   
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
    units: PropTypes.string.isRequired,         //y axis units of measure selected on eph page
  };

export default TimeSeries;