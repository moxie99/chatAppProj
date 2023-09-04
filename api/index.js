const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');

const app = express();
const PORT = 8000;
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');

mongoose
  .connect('mongodb+srv://chat-app:david2023__@cluster0.p6tcpqi.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to Mongo DB');
  })
  .catch((error) => console.log(`error connecting to DB ${error}`));

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const User = require('./models/user');
const Message = require('./models/message');

// register endpoint
app.post('/register', (req, res) => {
  const { name, email, password, image } = req.body;

  // create new user obj
  const newUser = new User({ name, email, password, image });
  // save user to db
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: 'User regsitered successfully' });
    })
    .catch((err) => {
      console.log('Error registering the user', err);
      res.status(500).json({ message: 'Error registering user' });
    });
});

// create token function

const createToken = (userId) => {
  const payload = {
    userId: userId,
  };
  const token = jwt.sign(payload, 'Q$r2K6W8n!jCW%Zk', { expiresIn: '1h' });
  return token;
};

// login endpoint

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // check if email and password are provided
  if (!email || !password) {
    return res.status(404).json({ message: 'Email and password are required' });
  }

  // check for User validity in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.password !== password) {
        return res.status(404).json({ message: 'Password does not match' });
      }

      const token = createToken(user._id);
      res.status(200).json({ message: 'Logged in Successfully', token });
    })
    .catch((error) => {
      console.log('error in finding the user', error);
      res.status(500).json({ message: 'Internal server Error!' });
    });
});
