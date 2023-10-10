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

// Get a list of all vehicles in the fleet
router.get('/vehicles', (req, res) => {
  const getAllVehiclesQuery = 'SELECT * FROM vehicles';
  db.query(getAllVehiclesQuery, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Add a new vehicle to the fleet
router.post('/vehicles', (req, res) => {
  const { name, make, model, year, registration_plate, driver_id } = req.body;

  // Insert the new vehicle into the database
  const insertVehicleQuery = 'INSERT INTO vehicles (name, make, model, year, registration_plate, driver_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertVehicleQuery, [name, make, model, year, registration_plate, driver_id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Vehicle added to the fleet' });
    }
  });
});

module.exports = router;
