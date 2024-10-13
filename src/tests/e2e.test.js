const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Update with your app's path
const User = require('../models/user'); // Update with your User model path
const jwt = require('jsonwebtoken'); // Import JWT for token creation

const adminUser = {
    username: 'admin',
    password: 'admin123',
    role: 'admin' // Setting the role for the admin user
};

const regularUser = {
    username: 'user',
    password: 'user123',
    role: 'user' // Setting the role for a regular user
};
const updatedUser = {
    username: 'updatedUser',
    password: 'updatedPassword',
    role: 'user'
};
const secondUser = {
    username: 'secondUser',
    password: 'secondUserPassword',
    role: 'user'
};
describe('Group Chat API End-to-End Tests', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            // Connect to the test database only if not already connected
            await mongoose.connect('mongodb://localhost:27017/stock_crypto_db_test', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        // Check if the admin user exists and create if not
        let admin = await User.findOne({ username: adminUser.username });
        if (!admin) {
            admin = new User(adminUser);
            await admin.save();
        }
    });
    let regularToken;
    let regularId;
    let secondId;

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close(); // Close the connection after tests
    });

    test('should register a new user (admin only)', async () => {
        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({ username: adminUser.username, password: adminUser.password });
    
        const adminToken = adminLoginResponse.body.token;
        const response = await request(app)
            .post('/auth/register') 
            .set('Authorization', `Bearer ${adminToken}`) 
            .send(regularUser);
        
            
        regularId = response.body._id
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    test('should register a new user (admin only)', async () => {
        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({ username: adminUser.username, password: adminUser.password });
    
        const adminToken = adminLoginResponse.body.token;
        const response = await request(app)
            .post('/auth/register') 
            .set('Authorization', `Bearer ${adminToken}`) 
            .send(secondUser);
        
            
        secondId = response.body._id
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });
    
    test('should not allow regular user to register new user', async () => {
        // Log in as regular user
        await request(app).post('/auth/register').send(regularUser); 
    
        const regularLoginResponse = await request(app)
            .post('/auth/login')
            .send({ username: regularUser.username, password: regularUser.password });
    
        const token = regularLoginResponse.body.token;
    
        // Try to register a new user as a regular user
        const response = await request(app)
            .post('/auth/register')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'newUser',
                password: 'newPassword',
                role: 'user'
            });
    
        expect(response.status).toBe(403); // Expecting a 403 Forbidden
        expect(response.body.message).toBe('Forbidden: Admins only');
    });
    

    test('should authenticate admin user', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: adminUser.username, password: adminUser.password });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('should not authenticate with wrong password', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: adminUser.username, password: 'wrongPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });
    
    test('should update user details (admin only)', async () => {
        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({ username: adminUser.username, password: adminUser.password });
    
        const adminToken = adminLoginResponse.body.token;
        const response = await request(app)
            .put('/auth/update')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updatedUser);
    
        expect(response.status).toBe(200);
    });
    
    test('should not allow regular user to update user details', async () => {
        const regularLoginResponse = await request(app)
            .post('/auth/login')
            .send({ username: regularUser.username, password: regularUser.password });
    
        const token = regularLoginResponse.body.token;
        const response = await request(app)
            .put('/auth/update')
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser);
    
        expect(response.status).toBe(403); 
        expect(response.body.message).toBe('Forbidden: Admins only');
    });

    test('should delete user (admin only)', async () => {
        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({ username: adminUser.username, password: adminUser.password });
    
        const adminToken = adminLoginResponse.body.token;
        const response = await request(app)
            .delete('/auth/delete')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ username: regularUser.username });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });
    
    test('should not allow regular user to delete user', async () => {
        const regularLoginResponse = await request(app)
            .post('/auth/login')
            .send({ username: regularUser.username, password: regularUser.password });
    
        const regularToken = regularLoginResponse.body.token;
        const response = await request(app)
            .delete('/auth/delete')
            .set('Authorization', `Bearer ${regularToken}`)
            .send({ username: 'newUser' });
    
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: Admins only');
    });

    test('should create a new group ,send message ,like message and delete the group', async () => {
        const regularLoginResponse = await request(app)
        .post('/auth/login')
        .send({ username: regularUser.username, password: regularUser.password });

        const regularToken = regularLoginResponse.body.token;

        const groupData = {
            name: 'Test Group',
            description: 'Group for testing purposes'
        };

        const response = await request(app)
            .post('/groups/create')
            .set('Authorization', `Bearer ${regularToken}`)
            .send(groupData);


        
        expect(response.status).toBe(201); 
        expect(response.body).toHaveProperty('group');
        expect(response.body.group.name).toBe(groupData.name);

          groupNewId = response.body.group._id;

            const messageData = {
                text: 'Hello, group!',
                groupId: groupNewId
            };
    
            const response3 = await request(app)
                .post('/messages/send')
                .set('Authorization', `Bearer ${regularToken}`)
                .send(messageData);
    
            expect(response3.status).toBe(201); 
            expect(response3.body).toHaveProperty('message');
            expect(response3.body.message.text).toBe(messageData.text);   

            messageId = response3.body.message._id
            
            const likeData = {
                messageId: messageId
            };
    
            const response4= await request(app)
                .post('/messages/like')
                .set('Authorization', `Bearer ${regularToken}`)
                .send(likeData);
    
            expect(response4.status).toBe(200);
            expect(response4.body).toHaveProperty('message', 'Message liked successfully');


        const groupId = groupNewId;

        const response5 = await request(app)
            .get(`/messages/${groupId}`)
            .set('Authorization', `Bearer ${regularToken}`);

        expect(response5.status).toBe(200);
        expect(response5.body).toHaveProperty('messages');
        expect(Array.isArray(response5.body.messages)).toBe(true);

        const response6 = await request(app)
            .delete(`/groups/${groupId}`)
            .set('Authorization', `Bearer ${regularToken}`);

        expect(response6.status).toBe(200); 
        expect(response6.body).toHaveProperty('message', 'Group deleted successfully');
    }); 
});
    