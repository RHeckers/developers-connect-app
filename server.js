const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mogoURI;

//Connect to MongoDB
mongoose.connect(db).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.log(error)
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = process.env.PORT || 5000;

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})