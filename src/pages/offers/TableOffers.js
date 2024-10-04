import React, { useEffect } from "react";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { departmentOffer, statusOffer } from "~/data/Constants";
const TableOffers = ({ filterOffer, candidate, dataOffer, currentPage }) => {
  const navigate = useNavigate();
  const getCandidateEmail = (candidateId) => {
    const candidateData = candidate.find((c) => c.id === candidateId);
    return candidateData ? candidateData.email : "N/A";
  };
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);
  return (
    <table className="table table--striped table--bordered table--hover table--responsive">
      <thead className="table__head">
        <tr className="table__row">
          <th className="table__header">Candidate Name</th>
          <th className="table__header">Email</th>
          <th className="table__header">Approver</th>
          <th className="table__header">Department</th>
          <th className="table__header">Notes </th>
          <th className="table__header">Status</th>
          <th className="table__header">Action</th>
        </tr>
      </thead>
      <tbody className="table__body">
        {filterOffer.length > 0 ? (
          filterOffer.map((offer) => (
            <tr key={offer.id} className="table__row">
              <td className="table__cell">
                {Object.values(offer.candidate).join(", ")}
              </td>
              <td className="table__cell">
                {getCandidateEmail(parseInt(Object.keys(offer.candidate)[0])) ||
                  "N/A"}
              </td>
              <td className="table__cell">{offer.approvedBy || "N/A"}</td>
              <td className="table__cell">
                {departmentOffer[offer.department]}
              </td>
              <td className="table__cell">{offer.note || "N/A"}</td>
              <td className="table__cell">
                {statusOffer[offer.offerStatus] || "N/A"}
              </td>
              <td className="table__cell">
                <div className="button-group">
                  <FaEye
                    onClick={() => navigate(`/offer/${offer.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <FaRegEdit
                    onClick={() => navigate(`/offer/edit/${offer.id}`)}
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                  />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No item matches with your search data. Please try again
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableOffers;
