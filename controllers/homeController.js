const Event = require('../models/eventModels');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const getHomePage = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    console.log("--------------------------------------------------------------------------------------------------------------------------------------------------this getHomepage from home controller",events);
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
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();



    return res.status(200).json({ message: 'User created successfully' });



  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).render('login', { title: 'Login', error: 'Internal Server Error' });

  }



}

const userExists = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie with token (HTTP-only, secure if using HTTPS)
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });


    return res.status(200).json({
      success: true,
      message: 'Sign in successful',

    });


  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


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


const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/login');

}

const getUserInfo = async (req, res) => {
  try {
    // Get user from auth middleware
    const user = req.user;
    console.log('Authenticated user:', user);

    const userEvent = await Event.find({createdBy: user.name}).sort({ createdAt: -1 });
    console.log('User created events:', userEvent);

    const joinedEvents = await Event.find({ attendees: user._id }).sort({ createdAt: -1 });
    console.log('--------------------------------------------------------------------------------------------------------------------------------------------------------Joined events:', joinedEvents);



    if (!user) {
      return res.status(401).json({ error: 'Login first' });
    }

    return res.status(200).render('userInfo', {
      title: 'User Profile',
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      userEvents: userEvent,
      joinedEvents: joinedEvents
    });



  } catch (error) {
    console.error('Error fetching user info from backend:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const bookMyEvent = async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    console.log('user id ', userId);
    console.log('event id ', eventId);

    if (!userId || !eventId) {
      return res.status(400).json({ message: 'userId or eventId missing' });
    }

    const bookedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { $addToSet: { attendees: userId } },
      { new: true }
    );

    if (!bookedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json({ message: 'Event booked successfully', event: bookedEvent.title});
  }catch (error) {
  
    console.error('Error booking event:', error);
    res.status(500).json({ error: 'Internal Server Error' });



  }
}

const unBookMyEvent = async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    console.log('user id ', userId);
    console.log('event id ', eventId);
    if (!userId || !eventId) {
      return res.status(400).json({ message: 'userId or eventId missing' });
    }
    const unBookedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { $pull: { attendees: userId } },
      { new: true }
    );
    if (!unBookedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json({ message: 'Event unbooked successfully', event: unBookedEvent.title });
  }catch (error) {
    console.error('Error unbooking event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const isEventBooked = async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventId = req.params.eventId; 
    console.log('user id form isBooked', userId);
    console.log('event id ', eventId);
    if (!userId || !eventId) {
      return res.status(400).json({ message: 'userId or eventId missing' });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const isBooked = Array.isArray(event.attendees) && event.attendees.some(id => id.toString() === userId);
    return res.json({ isBooked });
  } catch (error) {
    console.error('Error checking if event is booked:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 

}

const editEvent = async (req, res) => {
  try {
    console.log('Edit event request body:', req.body); // Debug logging
    
    const eventId = req.params.eventId;
    const { title, description, date, time, location, price } = req.body;
    console.log('Event ID to edit:', eventId);
    console.log('Updated event data:', req.body);
    if (!eventId) {
      return res.status(400).json({ message: 'eventId missing' });
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, description, date, time, location, price },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json({success:true, message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Error editing event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const deleteEvent =async (req,res)=> {
  try {
    const eventId = req.params.eventId;
    console.log('event id to delete', eventId);
    if(!eventId){
      return res.status(400).json({message:'eventId missing'})
    }
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if(!deletedEvent){
      return res.status(404).json({message:'Event not found'});
    }
    return res.status(200).json({success:true, message:'Event deleted successfully',event:deletedEvent});

    
  } catch (error) {
    console.log("Cannot delete an event",error);
    return res.status(500).json({error: 'Internal Server Error'})
    
  }
  
}

module.exports = {
  getHomePage,
  addEventPage,
  searchEvents,
  getloginPage,
  createNewUser,
  userExists,
  logoutUser,
  getUserInfo,
  bookMyEvent,
  unBookMyEvent,
  isEventBooked,
  editEvent,
  deleteEvent
};
