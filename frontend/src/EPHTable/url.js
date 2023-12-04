import React from "react";
import EPHTable from "./EPHTable";



function App(apiURL) {
  return (
    <div>
      <h1>EPA Table Data</h1>
      <EPHTable url={apiURL} />
    </div>
  );
}

export default App;
