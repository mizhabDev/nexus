const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');
const eventController = require('../controllers/eventController.js');
const { requireAuth } = require('../middleware/authMiddleware');




// get routers
router.get('/home',requireAuth, homeController.getHomePage);
router.get('/',homeController.getHomePage);
router.get('/add-event',requireAuth,homeController.addEventPage);
router.get('/login',homeController.getloginPage);
router.get('/user-info',requireAuth,homeController.getUserInfo);
router.get('/book-event/:userId/:eventId',requireAuth,homeController.bookMyEvent);
router.get('/is-booked/:userId/:eventId',requireAuth,homeController.isEventBooked);



// post router
router.post('/add-event',requireAuth,eventController.createEvent);
router.post('/signup', homeController.createNewUser);
router.post('/signin', homeController.userExists);
router.post('/logout', requireAuth, homeController.logoutUser);

// put router
router.put('/edit-event/:eventId', requireAuth, homeController.editEvent);

// delete router
router.delete('/delete-event/:eventId',requireAuth,homeController.deleteEvent)



module.exports = router;

