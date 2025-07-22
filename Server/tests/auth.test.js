const request = require('supertest');
const app = require('../server'); // Adjust if your Express app is exported elsewhere
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });
const User = require('../models/User');


  beforeAll(async () => {
    // Connect to test DB or mock db collection
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteOne({ email: 'testuser@example.com' });
});



  describe('Auth Endpoints', () => {
  it('should signup a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: 'testuser@example.com',
      password: 'Test1234',
      username: 'testuser'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'testuser@example.com',
      password: 'Test1234',
      username: 'testuser'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'Test1234'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});