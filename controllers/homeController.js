const Event = require('../models/eventModels');


const getHomePage = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    console.log(events);
    return res.render('home', { title: 'Home', events });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).send('Internal Server Error');
  }

};

const addEventPage = (req, res) => {
  res.render('addEvent', { title: 'Add New Event' });


}  


module.exports = {
    getHomePage,
    addEventPage
};
