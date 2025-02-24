// backend/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Sample endpoint for health check
app.get('/health', (req, res) => {
  res.send({ status: 'Backend running' });
});

// (Placeholder) Endpoint for receiving liquidity events from on-chain
app.post('/event', (req, res) => {
  const eventData = req.body;
  console.log("Received event:", eventData);
  // TODO: Call AI analysis functions here
  res.send({ message: 'Event received' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});