const Event = require('../models/eventModels');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');



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

const createNewUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Received user data:', req.body); // Debug logging

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'This is form backend All fields are required.' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({ name, email, password:hashedPassword });
    await newUser.save();

    res.status(200).json({ message: 'User created successfully' });

    
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).render('login', { title: 'Login', error: 'Internal Server Error' });

  }



}


const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'No search query provided' });
    }
    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    });

    console.log('Search results:', events);

    if (searchResults.length === 0) {
      return res.status(404).json({ message: 'No events found matching your query' });
    }

    res.render('home', { title: 'Search Results', events });
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getloginPage = (req, res) => {
  res.render('login', { title: 'Login' });
}



module.exports = {
  getHomePage,
  addEventPage,
  searchEvents,
  getloginPage,
  createNewUser
};
