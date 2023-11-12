/* Amrita - Exclusively the hazard pictogram portion of index.js */
import "./hazardsonly.css";
import React, { useState, useEffect } from 'react';
import LoadingSpinner from "../LoadingSpinner";
import PropTypes from "prop-types";
const { formatChemical } = require("../helpers");
const pubchem = require("../api/pubchem/index");

function handleError(err) {
  console.log("Error with PubChem")
}

function Link() {
  return (
    <div className="link-icon">
      <img src={require("./../../src/assets/openlink.png")} alt="" />
    </div>
  );
}

/* Hazards and Pictograms Component */
function HazardStatements(props) {
  const [pubchemData, setPubchemData] = useState(null);
  const link = `https://pubchem.ncbi.nlm.nih.gov/compound/${props.cid}#section=Safety-and-Hazards`;

  const { onLoad } = props;

  // fetches data when component is updated
  useEffect(() => {
    async function getPubchemData() {
      try {
        const response = await pubchem.get(
          "/pug_view/data/compound/" +
            props.cid +
            "/JSON?heading=GHS+Classification"
        );
        const data = parseGHSData(response);
        setPubchemData(data);
      } catch (err) {
        handleError(err);
      } finally {
        console.log("hazardStatements loaded");
        onLoad();
      }
    }

    if (!pubchemData && props.cid) {
      getPubchemData();
    }
  }, [props.cid, pubchemData, onLoad]);

  function parseGHSData(response) {
    const info =
      response.data.Record.Section[0].Section[0].Section[0].Information;
    var pictograms = [];
    var hazardStatements = [];

    // pictograms: first element of Information Array
    pictograms = info[0].Value.StringWithMarkup[0].Markup.map((pic) => ({
      description: pic.Extra || "unknown",
      href: pic.URL,
    }));
    // pictograms: third element of Information Array
    hazardStatements = info[2].Value.StringWithMarkup.map((st) => st.String);
    return { pictograms, hazardStatements };
  }

  return (
    pubchemData !== null && (
      <div className="hazardsonly">

        <div className="pictograms">
          {pubchemData.pictograms.map((v, i) => {
            return (
              /* Amrita - Shows hazard pictogram and name */
              <div className="pictogram" key={v.description}>
                <img src={v.href} alt="" key={v.description}></img>{" "}
                <div className="description">{v.description}</div>

              </div>
            );
          })}
        </div>
      </div>
    )
  );
}

function Content(props) {
  const [loaded, setLoaded] = useState(false);
  const [numLoaded, setNumLoaded] = useState(0);

  function increment() {
    setNumLoaded((numLoaded) => numLoaded + 1);
  }

  useEffect(() => {
    if (numLoaded === 1 && !loaded) {
      setLoaded(true);
    }
  }, [loaded, numLoaded]);

  return (
    <div>
      {!loaded && (
        <div className="loading-overlay">
          <div className="spinner">
            <LoadingSpinner />
          </div>
        </div>
      )}
      <div className={`Hazards ${loaded ? "" : "loading"}`}>
        {props.chemName !== "" && (
          <div className="hazards-chem-name">
            {/* Amrita - Adding chemical name on the top inside popup */}
            <h1>{props.chemName}</h1>
          </div>
        )}
        {props.cid && (
          <div className="loaded-content">
            <HazardStatements
              cid={props.cid}
              onLoad={increment}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Hazards(props) {
  const [cid, setCid] = useState(null);
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getPugRestData(chemName) {
    try {
      chemName = formatChemical(chemName);
      let state = {};
      let cid = null;
      const nameResponse = await pubchem.get(
        `pug/compound/name/${chemName}/property/MolecularFormula/JSON`
      );

      cid = nameResponse.data.PropertyTable.Properties[0].CID;
      state = {
        cid,
        formula: nameResponse.data.PropertyTable.Properties[0].MolecularFormula,
      };
      const CidResponse = await pubchem.get(
        `/pug/compound/cid/${cid}/Description/JSON`
      );

      if (CidResponse.data.InformationList.Information.length > 1) {
        state.description = CidResponse.data.InformationList.Information[1].Description;
      }
      setCid(state.cid);
      setDescription(state.description);
    } catch (err) {
      console.log(`err: "${chemName}" not found`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (props.chemName !== "") {
      getPugRestData(props.chemName);
    }
  }, [props.chemName]);

  return (
    cid || isLoading ? (
      <Content
        description={description}
        cid={cid}
        chemName={formatChemical(props.chemName)}
      />
    ) : (
      <div className="chemical-not-found">
        Pubchem data for {props.chemName} could not be found.
      </div>
    ))
  }

Hazards.propTypes = {
  chemName: PropTypes.string.isRequired,
};

export default Hazards;
