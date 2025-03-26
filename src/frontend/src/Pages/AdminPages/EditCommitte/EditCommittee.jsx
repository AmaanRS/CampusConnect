import React from "react";
import { useParams } from "react-router-dom";

export default function EditCommittee() {
  const { committeeId } = useParams();
  return <div>EditCommittee - {committeeId}</div>;
}
