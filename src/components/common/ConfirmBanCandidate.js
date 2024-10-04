import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmBanModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Ban</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to ban this candidate?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button data-testId = "bancandidate" variant="danger" onClick={handleConfirm}>
          Ban
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmBanModal;
