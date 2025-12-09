const API_BASE = "http://localhost:5000";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    body: formData
  });

  return res.json();
};

export const fetchDocuments = async () => {
  const res = await fetch(`${API_BASE}/documents`);
  return res.json();
};

export const deleteDocument = async (id) => {
  return fetch(`${API_BASE}/documents/${id}`, {
    method: "DELETE"
  });
};

export const downloadDocument = (id) => {
  window.open(`${API_BASE}/documents/${id}`, "_blank");
};
