/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Modal from "react-modal";
import errorImg from "../../utils/pics/error.svg";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

const Alert = ({ isOpen, onRequestClose, message }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
    contentLabel="Alert Dialog"
  >
    <div className="flex justify-center flex-col items-center">
      <h2 className="text-blue-dark font-medium">{message}</h2>
      <img src={errorImg} alt="" className="w-1/3 my-3 xl:w-1/2" />
      <button
        onClick={onRequestClose}
        className="px-4 py-2 mt-4 text-white bg-blue-light rounded"
      >
        Close
      </button>
    </div>
  </Modal>
);

export default Alert;
