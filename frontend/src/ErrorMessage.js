import React from 'react';


const ErrorMessages = (props) => {

if (props.error === "county data") {
    return (<div className='county'>"Sorry there is no data found for county level data"</div>);
    
}

else if (props.error === "state data") {
    return (<div className='state'>"Sorry there is no data found for state level data"</div>)
}

else if (props.error === "national data") {
    return (<div className='national'>"Sorry there is no data found for state level data"</div>)
}
console.log(props.error);
}


export default ErrorMessages;