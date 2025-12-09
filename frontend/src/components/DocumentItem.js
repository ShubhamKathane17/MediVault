import { deleteDocument, downloadDocument } from "../services/api";

function DocumentItem({ doc }) {
  return (
    <div className="document-item">
      <span>{doc.filename}</span>

      <div className="document-actions">
        <button
          type="button"
          className="download"
          onClick={() => downloadDocument(doc.id)}
        >
          Download
        </button>

        <button
          type="button"
          className="delete"
          onClick={() =>
            deleteDocument(doc.id).then(() => window.location.reload())
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DocumentItem;
