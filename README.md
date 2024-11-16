# Portfolio Management System

This project is a web-based portfolio management system that allows users to register, log in, manage posts, and enable/disable two-factor authentication (2FA). It includes the following features:

- **User Registration & Login**: Allows users to create accounts and log in securely.
- **Portfolio Post Management**: Users can create, view, and delete portfolio posts.
- **Two-Factor Authentication (2FA)**: Users can enable or disable 2FA to secure their accounts.
- **Registration Email Notification**: Upon successful registration, an email is sent to the user. The email message includes a welcome note.
 

## Features

- **User Roles**: Admins can manage posts (delete posts), while regular users can only view posts.
- **2FA Support**: Two-factor authentication is supported using an authenticator app. The user can enable or disable it via the app.
- **Post Creation**: Users can create portfolio posts with binary image data.

## Technologies Used

- **Backend**:
  - Express.js: Web server framework for Node.js.
  - MongoDB: NoSQL database to store user and post data.
  - Passport.js: Authentication middleware to secure the routes.
  - JSON Web Tokens (JWT): Used for authentication and session management.
  - Nodemailer: Used to send welsome email to new user.
  
- **Frontend**:
  - HTML, CSS, and JavaScript for the user interface.
  - QR Code generation for enabling 2FA.

## Getting Started

### Prerequisites

- Node.js
- MongoDB (You can use MongoDB Atlas for a cloud database or run it locally)
- A code editor like VSCode

### Installation

1. Clone the repository:

   git clone git@github.com:HolySxn/Portfolio-Platform.git
   

2. Install the dependencies:

   npm install
   

3. Start the server:

   node app.js 
   

   The server will be running on `http://localhost:3000`.

4. Open in your browser `http://localhost:3000/auth/register` to register

you can use email: test1@gmail.com password: 123456789 to login into admin account

### API Routes

- **POST `/auth/register`**: Registers a new user.
- **POST `/auth/login`**: Logs a user in.
- **POST `/auth/2fa/enable`**: Enables two-factor authentication for the logged-in user.
- **POST `/auth/2fa/disable`**: Disables two-factor authentication for the logged-in user.
- **GET `/auth/2fa/status`**: Checks the 2FA status of the logged-in user.
- **GET `/auth/user`**: Gets the details of the logged-in user.
- **GET `/portfolio`**: Gets all posts of the logged-in user.
- **POST `/portfolio/create`**: Creates a new portfolio post.
- **DELETE `/portfolio/:id`**: Deletes a portfolio post by ID.

### Frontend Features

- **Registration & Login Pages**: Forms for registering a new user and logging in.
- **Portfolio Posts**: Users can view posts, and admins can delete them.
- **2FA Section**: Displays options to enable or disable 2FA and shows a QR code when enabling it.
