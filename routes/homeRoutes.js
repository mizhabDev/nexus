const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');
const eventController = require('../controllers/eventController.js');
const { requireAuth } = require('../middleware/authMiddleware');




// get routers
router.get('/home',requireAuth, homeController.getHomePage);
router.get('/',homeController.getHomePage);
router.get('/addEvent',requireAuth,homeController.addEventPage);
router.get('/login',homeController.getloginPage);



// post router
router.post('/add-event',requireAuth,eventController.createEvent);
router.post('/signup', homeController.createNewUser);
router.post('/signin', homeController.userExists);
router.post('/logout', requireAuth, homeController.logoutUser);



module.exports = router;

