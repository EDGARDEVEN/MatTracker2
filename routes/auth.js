const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config'); // Create a config.js file to store your secrets

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'your-database-host',
  user: 'your-database-user',
  password: 'your-database-password',
  database: 'your-database-name',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// User registration route
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      // Hash the password before storing it in the database
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertUserQuery, [username, hashedPassword], (insertErr) => {
          if (insertErr) {
            res.status(500).json({ error: 'Internal server error' });
            return;
          }

          res.status(201).json({ message: 'User registered successfully' });
        });
      });
    }
  });
});

// User login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user from the database
  const getUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(getUserQuery, [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, results[0].password, (compareErr, match) => {
        if (compareErr || !match) {
          res.status(401).json({ error: 'Authentication failed' });
          return;
        }

        // Create a JWT token for authentication
        const token = jwt.sign(
          { userId: results[0].id, username: results[0].username },
          config.jwtSecret,
          { expiresIn: '1h' }
        );

        res.status(200).json({ token });
      });
    }
  });
});

module.exports = router;
