const express = require("express");
const cors = require("cors");

const documentRoutes = require("./routes/routes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/documents", documentRoutes);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
