const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const authRoutes = require('./routes/auth');
const fleetRoutes = require('./routes/fleet');
const fareRoutes = require('./routes/fare');

const app = express();
const port = process.env.PORT || 3000;

// Configure MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '8257',
  database: 'mattracker',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());

// Define routes
app.use('/auth', authRoutes);
app.use('/fleet', fleetRoutes);
app.use('/fare', fareRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
