import "./index.css";
const React = require("react");

function About() {
  return (
    <div className="about-container">
      <div className="background">
        <div className="overlay"></div>
      </div>
      <div className="content">
        <h1>About</h1>
        <div>
          Chemicals and products released into the environment, applied to our foods, and present in the 
          products we consume, are some of the most dangerous risks to human health and quality of life. 
          <br />
          <br />
          The European Environmental Agency considers air pollution{" "}
          <a href="https://www.eea.europa.eu/themes/air/">
            "the biggest environmental health risk in Europe."
          </a>{" "}
          Studies indicate that in general, {" "}
          <a href="https://link.springer.com/article/10.1007/s11356-020-09042-2">
            "air pollution is one of the most important reasons for serious human health effects including 
            cardiovascular and respiratory illnesses."
          </a>{" "}
          Industries emit various toxic chemicals (e.g. carcinogens, endocrine disruptors, 
          environmental hazards) into the air, land and water everyday, including "dioxins" and persistent 
          bioaccumulative toxic (PBT) chemicals. They are released by the thousands of pounds every year 
          across the United States, near to cities and villages, or farms and lakes. These releases are known 
          and the data of reports {" "}
          <a href="https://www.epa.gov/toxics-release-inventory-tri-program/tri-listed-chemicals">
            are publicly available.
          </a>
          <br />
          <br />
          More recently, evidence has accumulated regarding the {" "}
          <a href="https://www.plasticpollutioncoalition.org/blog/2022/07/12/plastic-tox-shanna-swan">
            association between phthalates - plasticizers used to make plastic - and sex hormone development,
          </a>{" "}
          including the current {" "}
          <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4214967/">
            crisis of infertility and allergies.
          </a>{" "}
          Similarly, PFAS — a family of synthetic chemicals used in non-stick pans and several other consumer 
          products — have been dubbed "forever chemicals" given their strong and long lasting bonds. They have also been {" "}
          <a href="https://www.niehs.nih.gov/health/topics/agents/pfc">
            associated with several health issues.
          </a>{" "}
          Various other chemicals in consumer products and industrial processes,{" "}
          <a href="https://www.niehs.nih.gov/health/topics/agents/pfc">
            such as Bisphenol A (BPA) and hexavalent chromium,
          </a>{" "}
          which have serious health implications, are released into the environment or come in direct contact 
          with our bodies on a daily basis (e.g. plastic receipts that contain BPA).
          <br />
          <br />
          <hr />
          <br />
          <div>
            To bring awareness to these environmental health risks, we have developed the Visualizer of 
            Environmental Health Risks (VEHRS) web application. This application was developed to inform the 
            public, scientists and policy makers alike to learn about toxic releases into the air, land and water 
            across regions and localities in the United States. VEHRS obtains information from the Toxic 
            Release Inventory (TRI) database of the US Environmental Protection Agency (EPA), as well as 
            associated chemical information from the PubChem database of the National Library of Medicine, 
            to map, organize and visualize releases of toxic chemicals in any city, county or state in the US 
            searched by the user. VEHRS also obtains data from the CDC's Environmental Public Health 
            Tracking Network to highlight specific health outcomes potentially associated with environmental toxicants.
          
            <br />
            <br />
            When data is available, VEHRS shows specific toxic releases, most released chemicals, and 
            various types of potentially related health outcomes and conditions, in or around the locality searched for by 
            the user, including historical trends in the data (i.e. years of available data up to the end of 2023). 
            Toxicity is a complex issue, and the hazards of a chemical or compound are dependent on amount 
            and concentration, the population at question, and a specific time frame. This tool is thus for 
            informative and exploratory purposes only, and it is not intended to diagnose or treat any particular 
            disease for any specific person. Further documentation about the application and the data herein 
            can be found in the following sites:

            <ul>
              <li><a href="https://www.epa.gov/toxics-release-inventory-tri-program">Toxic Releases Inventory (TRI)</a></li>
              <li><a href="https://pubchem.ncbi.nlm.nih.gov/">PubChem</a></li>
              <li><a href="https://ephtracking.cdc.gov/">CDC Environmental Public Health Tracking</a></li>
              <li><a href="https://github.com/lhei-git/Visualizer-of-Environmental-Toxicants">Application Github</a></li>
            </ul>
          </div>

        </div>

        <br />
        <div>
          <h2>Creators of VEHRS</h2>
          VEHRS was developed by Taimee Hassan, Katherine O'Donnell, Amrita Dhar, and Farzana Israt, 
          for their senior capstone project (Winter 2023). This project built upon the VET application 
          created by Evan de Jesus, Adwait Wadekar, Richard Moore and Calvin Brooks (Fall 2020). The 
          project was conceptualized and guided by Nic DePaula for the
          <a href="https://www.lhei.org/" > Lab for Health and Environmental Informatics (LHEI).</a>
        </div>
        <br />

        <br />
        <div>
          <h2>DISCLAIMER</h2>
          This application is intended for exploratory purposes only. Data and information from this product 
          have not been thoroughly validated, and individuals should consult the data sources to better understand 
          the information presented herein.
        </div>
        <br />

        <div className="credits">
          <span>
            Home and About page photo by{" "}
            <a href="https://unsplash.com/@chrisliverani?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
              Chris Liverani
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
              Unsplash
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default About;
