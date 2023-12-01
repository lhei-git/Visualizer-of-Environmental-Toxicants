import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label} from 'recharts';
import "./timeseries.css";

const TimeSeries = ({ data, size, units }) => {
    const chartContainer = useRef(null);        //get size of container
    const [sizeDynamic, setSize] = useState({ width: 0, height: 0 });
    
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
        <p>dynamic width: {sizeDynamic.width} dynamic height: {sizeDynamic.height}</p>
      <LineChart width={sizeDynamic.width} height={sizeDynamic.height} data={data}>
        <CartesianGrid />
        <XAxis dataKey="year" />
        <YAxis>
          <Label 
            style={{textAnchor: "middle"}}
            angle={270} 
            position='insideLeft'
            value={units}
            margin={200}/>
        </YAxis>
        <Tooltip />
        <Line name="Concentration" type="monotone" dataKey="dataValue" stroke="purple" />
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