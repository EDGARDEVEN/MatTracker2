const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '8257',
  database: 'mattracker',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Define routes for fare calculation

// Calculate fare for a specific ride
router.post('/calculate', (req, res) => {
  const { distance_km, duration_minutes } = req.body;

  const farePerKilometer = 0.5; // Replace with your fare calculation logic
  const farePerMinute = 0.2; // Replace with your fare calculation logic

  const totalFare = (distance_km * farePerKilometer) + (duration_minutes * farePerMinute);

  res.status(200).json({ fare: totalFare });
});

module.exports = router;
