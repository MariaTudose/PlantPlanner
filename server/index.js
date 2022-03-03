const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('./models/plant');
const middleware = require('./utils/middleware');

const app = express();
const PORT = process.env.PORT;
const url = process.env.MONGODB_URI;

mongoose.connect(url);

app.use(cors());
app.use(middleware.requestLogger);

app.get('/api/plants', (req, res) => {
    Plant.find({ isDeleted: false }).then(plants => {
        res.json(plants);
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(middleware.unknownEndpoint);
