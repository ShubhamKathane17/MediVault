import { useEffect, useState } from "react";
import { fetchDocuments } from "../services/api";
import DocumentItem from "./DocumentItem";

function DocumentList({ refresh }) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetchDocuments().then(setDocs);
  }, [refresh]);

  return (
    <div className="card">
      <h3>Uploaded Documents</h3>
      {docs.length === 0 && <p>No documents uploaded yet.</p>}
      {docs.map((doc) => (
        <DocumentItem key={doc.id} doc={doc} />
      ))}
    </div>
  );
}

export default DocumentList;
