
import React, { useContext } from "react";
import { Button, Row } from "react-bootstrap";
import SearchCandidate from "./SearchCandidate";
import CandidateTable from "./CandidateTable";
import "../../assets/css/candidate-css/Candidate.css";



export default function Candidate() {


  return (
    <div className="App">


      
      <div className="breadcrumb__group">
        <span
          className="breadcrumb-link"
          
        >
          Candidate List
        </span>
       
      </div>

     
      <CandidateTable />
    </div>
  );
}
