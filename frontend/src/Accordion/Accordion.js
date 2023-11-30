import React, { useState } from 'react';
import "./Accordion.css";

const Accordion = ({ title, content, measure }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span>{isOpen ? '▼' : '►'}</span>
      </div>
      {isOpen && {measure} && <div className="accordion-content">{content}</div>}
    </div>
  );
};

export default Accordion;
