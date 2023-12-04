import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import "./timeseries.css";

const TimeSeries = ({ data, size, units }) => {
    const chartContainer = useRef(null);        //get size of container
    const [sizeDynamic, setSize] = useState({ width: 0, height: 0 });

    
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
    
    useEffect(() => {
        const updateDimensions = () => {
          if (chartContainer.current) {
            const containerWidth = chartContainer.current.clientWidth;
            const containerHeight = chartContainer.current.clientHeight;
            const padding = 20;
            const calculatedWidth = containerWidth - 200;
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

    return (
    <div ref={chartContainer} className='time-series-container'>
       
      <LineChart width={sizeDynamic.width} height={sizeDynamic.height} data={data}>
      <CartesianGrid vertical={false} />
        <XAxis dataKey="year" />
        <YAxis>
          <Label 
            style={{textAnchor: "middle"}}
            angle={270} 
            position='insideLeft'
            value={units}
            margin={200}/>
        </YAxis>
        <CustomTooltip></CustomTooltip>
        <CustomLine name="Percent" type="monotone" dataKey="dataValue" stroke="#9c27b0" />
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