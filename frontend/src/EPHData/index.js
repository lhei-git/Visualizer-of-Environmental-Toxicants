const React = require("react");


function EPHData() {
    
/*
    const options = [
        { label: 'Biomonitoring: Population Exposures', value: 'biomonitoring' }, 
      ];
      const [value, setValue] = React.useState('biomonitoring');
    const handleChange = (event) => {
    setValue(event.target.value);

 };
        return (
            <div className="container">
            <Dropdown
             options={options}
             value={value}
             onChange={handleChange}
            />
          </div>
        );
      };

      const Dropdown = ({ label, value, options, onChange }) => {
        return (
            <select value={value} onChange={onChange}>
              {options.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
       
        );
       
      */

        const options = [
            { label: <iframe src="https://ephtracking.cdc.gov/DataExplorer/?query=e2b1e9e8-d4fb-41a4-b558-aa9be5a9a69b&G1=2" width= '1048' height="780" title="CDC Tracking Network Chart" style="border:0;" allowfullscreen></iframe>, value: 'Biomonitoring' }, 
          ];
          const [value, setValue] = React.useState('biomonitoring');
          const handleChange = (event) => {
          setValue(event.target.value);
        };
 

     

return ( 
<div className="container">
      <div className="background">
        <div className="overlay"></div>
      </div>
      <div className="content">
        <div className="dropdown">  
        <Dropdown
             options={options}
             value={value}
             onChange={handleChange}
            />
        </div>
        </div>       
    </div>
   

)};


const Dropdown = ({ label, value, options, onChange }) => {
    return (
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
   
    );

}    



export default EPHData; 
