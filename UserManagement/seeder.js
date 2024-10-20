const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User'); // Adjust the path to your User model

const users = [
  {
    name: 'Ruffy',
    email: 'Ruffy@example.com',
    password: 'password123',
  },
  {
    name: 'Zolo',
    email: 'Zolo@example.com',
    password: 'password123',
  },
  {
    name: 'Blook',
    email: 'Blook@example.com',
    password: 'password123',
  },
];
mongo_uri = 'mongodb://localhost:27017/user_data'
const seedUsers = async () => {
  try {
    await mongoose.connect(mongo_uri);

    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    await User.insertMany(users);
    console.log('Users added to the database');
    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedUsers();
