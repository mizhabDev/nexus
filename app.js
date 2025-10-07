const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('@dotenvx/dotenvx').config()

const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');



app.use(authenticateToken); //jwt middleware


// Database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.log('something erorr has happen',err);
  process.exit(1);
});





// Routes
const homeRoutes = require('./routes/homeRoutes.js'); 
app.use('/', homeRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});


// Server
const PORT = process.env.API_PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
