**Nexus Events Co.**

Nexus Events Co. is an event management web application where users can create, edit, delete, and book events. It provides a simple and secure platform for event organizers and participants to connect easily.


**=> Project Overview**

Nexus Events Co. allows users to:
- Register and sign in securely.
- Create their own events with complete details.
- View and book available events.
- Edit or delete events they have created.

This platform ensures a smooth and secure experience for both event creators and attendees.


=> Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS (Embedded JavaScript Templates)  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Token)  
- **Password Security:** bcrypt  
- **Architecture:** MVC (Model–View–Controller)


=> Features

-  **User Authentication:** Secure login and registration using JWT tokens.  
-  **Password Encryption:** All passwords are hashed with bcrypt for enhanced security.  
-  **Event Management:** Users can create, edit, and delete their own events.  
-  **Event Booking:** Signed-in users can book and join events created by others.  
-  **MVC Structure:** Clean code organization separating logic, views, and routes.  
-  **Dynamic Rendering:** EJS used for rendering user-specific content dynamically.  
-  **Data Persistence:** MongoDB for storing users, events, and booking information.


=> Folder Structure

Nexus-Events-Co/
│

├── models/ # Database models (User, Event)

├── views/ # EJS templates for frontend

├── routes/ # Application routes

├── controllers/ # Route logic and business operations

├── middleware/ # JWT authentication and other middlewares

├── public/ # Static assets (CSS, JS, images)

├── app.js # Main entry point

└── package.json


**=> Installation & Setup**

- Follow these steps to run the project locally:
- npm install
nodemon app.js
