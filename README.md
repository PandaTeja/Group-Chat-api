# Group-chat-application-api

Group Chat Application This project is a Group Chat Application built using Node.js, Express, MongoDB, and JWT for authentication. It allows users to create and manage chat groups, send messages, and have role-based access control (e.g., admin can create/delete users and groups).
Features User Authentication: Login and registration using JWT. Admin Management: Admins can create, update, and delete users and groups. Role-Based Access Control: Admins and regular users have different levels of access. Group Chat: Users can create groups, add members, and send messages to group chats. Real-time Messaging: Messages within groups are available to all members in real time. Technologies Used Node.js: Backend runtime. Express.js: Web framework for building APIs. MongoDB: NoSQL database for storing user data, groups, and messages. Mongoose: ODM for MongoDB. JWT (JSON Web Tokens): For secure authentication. Supertest: For API testing. Nodemon: For automatic server restarting during development. Getting Started Prerequisites Make sure you have the following installed:
Node.js (v14 or higher) MongoDB (local instance or MongoDB Atlas) npm (comes with Node.js) Installation Clone the repository: git clone https://github.com/PandaTeja/Group-chat-api/
Navigate to the project directory: cd group-chat-app
Install dependencies:
npm install Set up environment variables:
Create a .env file in the root of the project and add the following:
PORT=3000 MONGODB_URI=mongodb://localhost:27017/stock_crypto_db JWT_SECRET=your_jwt_secret
Start the MongoDB server (if running locally): mongod
Run the application: Copy code npm start
OR, for development with Nodemon: npx nodemon src/server.js
Access the API:
The server will be running on http://localhost:3000.
Running Tests
To run the end-to-end tests for your API using Supertest, run: npm test
