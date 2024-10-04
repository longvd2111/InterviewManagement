import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import { Modal, Button, Form } from "react-bootstrap";
import { headersExport } from "~/data/Constants";
import { Row, Col } from "react-bootstrap";

export default function ButtonOffer({ dataOffer }) {
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [processedData, setProcessedData] = useState([]);

  const handleExport = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFromDate("");
    setToDate("");
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length !== 3) return "";
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };
  const processDataForExport = (data) => {
    return data.map((item) => {
      const candidateIds = Object.keys(item.candidate);
      const processedItem = {
        id: item.id,
        candidateId: candidateIds[0] || "",
        candidateName: item.candidate?.[candidateIds] || "",
        approvedBy: item.approvedBy || "N/A",
        contractType: item.contractType || "",
        position: item.position || "",
        offerLevel: item.offerLevel || "",
        department: item.department || "",
        recruiterOwnerName: item.recruiterOwner?.name || "",
        interviewerName:
          item.interviewSchedule?.interviewerDto?.[0]?.name || "",
        contractFrom: Array.isArray(item.contractFrom)
          ? formatDate(item.contractFrom)
          : item.contractFrom,
        contractTo: Array.isArray(item.contractTo)
          ? formatDate(item.contractTo)
          : item.contractTo,
        basicSalary:
          typeof item.basicSalary === "number"
            ? item.basicSalary.toFixed(2)
            : item.basicSalary || "",
        note: item.note || "",
      };
      return processedItem;
    });
  };

  const handleSubmit = () => {
    if (!fromDate || !toDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (startDate > endDate) {
      alert("Start date must be before or equal to end date.");
      return;
    }

    const filtered = dataOffer.filter((offer) => {
      const offerDate = new Date(
        offer.dueDate[0],
        offer.dueDate[1] - 1,
        offer.dueDate[2]
      );
      return offerDate >= startDate && offerDate <= endDate;
    });

    if (filtered.length === 0) {
      alert("No offer on the selected date");
    } else {
      const processed = processDataForExport(filtered);
      setProcessedData(processed);
      // Delay to ensure state is updated before triggering download
      setTimeout(() => document.getElementById("csvLink").click(), 0);
      setShowModal(false);
    }
  };
  return (
    <div className="changed">
      <div className="offer-button">
        <Button
          className="button-form button-form--success"
          style={{ marginRight: "10px" }}
          as={Link}
          to="/offer/add"
        >
          Add New
        </Button>
        <Button
          className="button-form button-form--primary"
          onClick={handleExport}
        >
          Export Offer
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <h3 className="text-center">Export Offer</h3>
        <div className="modal-input">
          <Form className="modal-form">
            <Row>
              <Col>
                <Form.Group className="modal-date">
                  From
                  <Form.Control
                    size="sm"
                    className="w-50"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="modal-date">
                  To
                  <Form.Control
                    size="sm"
                    className="w-50"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="offer-button btn-modal ">
          <button
            className="button-form button-form--danger"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button
            className="button-form button-form--success"
            onClick={handleSubmit}
          >
            Export
          </button>
        </div>
        <CSVLink
          id="csvLink"
          style={{ display: "none" }}
          enclosingCharacter={``}
          separator=";"
          headers={headersExport}
          filename={`OfferList-${fromDate}-${toDate}`}
          data={processedData}
        />
      </Modal>
    </div>
  );
}
