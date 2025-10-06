const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');
const eventController = require('../controllers/eventController.js');




// get routers
router.get('/home', homeController.getHomePage);
router.get('/', homeController.getHomePage);
router.get('/addEvent', homeController.addEventPage);



// post router
router.post('/add-event', eventController.createEvent);


module.exports = router;
