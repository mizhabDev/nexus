const express = require('express');
const Event = require('../models/eventModels');
const router = express.Router();

// const eventController = {
//     createEvent: async (req, res) => {
//         try {
//             const { title, date, time, location, price, description, userId } = req.body;
//             const newEvent = new Event({ title, date, time, location, price, description, userId });
//             await newEvent.save();
//             res.redirect('/home');
//         } catch (error) {
//             console.error('Error creating event:', error);
//             res.status(500).send('Internal Server Error');
//         }
//     }
// };


const createEvent = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug logging
        
        if (!req.body) {
            return res.status(400).json({ error: 'No request body received' });
        }

        const { title, date, time, location, price, description } = req.body;
        
        // Validate required fields
        if (!title || !date || !time || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newEvent = new Event({
            title,
            date,
            time,
            location,
            price: price || 'Free',
            description
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





module.exports = {
    createEvent,
  
};





