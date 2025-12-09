const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/documents', routes);

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});
