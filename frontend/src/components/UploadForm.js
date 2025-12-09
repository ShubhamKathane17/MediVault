import { useState } from "react";
import { uploadFile } from "../services/api";

function UploadForm({ onUpload }) {
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setMessage("❌ Please upload a valid PDF file");
      return;
    }

    await uploadFile(file);
    setMessage("✅ File uploaded successfully");
    onUpload();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleUpload(e.dataTransfer.files[0]);
  };

  return (
    <div className="card">
      <h3>Upload Medical Document</h3>

      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p>📄 Drag & drop your PDF here</p>
        <p>or</p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UploadForm;
