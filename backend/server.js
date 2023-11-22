const express = require("express");
const axios = require("axios"); // Import the axios library
const app = express();
const port = 3001;

app.use("/", (req, res) => {
  const url = "https://ephtracking.cdc.gov/apigateway/api/v1" + req.url;
  axios.get(url) // Use axios for the HTTP request
    .then(response => {
      res.send(response.data); // Send the response data to the client
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      res.status(500).send("An error occurred while fetching data.");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
