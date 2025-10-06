const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('@dotenvx/dotenvx').config()


const app = express();
 
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Database
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('MongoDB connected'))
  .catch(err => console.log('something erorr has happen',err));




 
// Routes
const homeRoutes = require('./routes/homeRoutes.js'); 
app.use('/', homeRoutes); 

// Server
const PORT = process.env.API_PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
