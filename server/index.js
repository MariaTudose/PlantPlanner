const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('./models/plant');
const Action = require('./models/action');
const middleware = require('./utils/middleware');

const app = express();
const PORT = process.env.PORT;
const url = process.env.MONGODB_URI;

mongoose.connect(url);

app.use(cors());
app.use(middleware.requestLogger);

app.use(express.static('public'));
app.use(express.json());

app.get('/api/plants', (req, res) => {
    //const plants = middleware.allPlants.map(plant => ({ ...plant, id: plant._id }));
    //res.send(plants);
    Plant.find({ isDeleted: false })
        .populate('scheduleId')
        .then(plants => {
            res.json(plants);
        });
});

app.put('/api/plants/:id', (req, res, next) => {
    Plant.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedPlant => {
            //console.log('updatedplant', updatedPlant);
            res.json(updatedPlant);
        })
        .catch(error => next(error));
});

app.put('/api/plants', (req, res, next) => {
    const bulkOps = req.body.map(plant => ({
        updateOne: {
            filter: {
                _id: plant.id,
            },
            update: {
                lastWateringDate: plant.lastWateringDate,
                nextWateringDate: plant.nextWateringDate,
            },
        },
    }));

    Plant.bulkWrite(bulkOps)
        .then(opResult => {
            if (opResult.ok) {
                Plant.find({ isDeleted: false })
                    .populate('scheduleId')
                    .then(plants => {
                        res.json(plants);
                    });
            }
        })
        .catch(error => next(error));
});

app.get('/api/actions/:plantId', (req, res, next) => {
    Action.find({ plantId: req.params.plantId, action: 'water' })
        .then(actions => res.json(actions))
        .catch(error => next(error));
});

app.post('/api/actions', (req, res, next) => {
    // TODO: update plant dates
    Action.insertMany(req.body)
        .then(actions => {
            res.json(actions);
        })
        .catch(error => next(error));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
