import { useState } from "react";
import UploadForm from "./components/UploadForm";
import DocumentList from "./components/DocumentList";
import "./App.css";


function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="App">
      <h1>MediVault</h1>
      <UploadForm onUpload={() => setRefresh(!refresh)} />
      <DocumentList refresh={refresh} />
    </div>
  );
}

export default App;
