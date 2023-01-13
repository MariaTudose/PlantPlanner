const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

const unknownEndpoint = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, _, response, next) => {
    console.error(error.message);

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

/*const data = require('../build/formattedData.json');

const calculateTimeDiff = (first, second = Date.now()) =>
    Math.round((new Date(first) - new Date(second)) / (1000 * 3600 * 24));

const actions = data.find(obj => obj.collectionName === 'actions').docs.filter(item => item.action === 'water');

const getPrevIntervals = plant => {
    const intervals = [];
    let dates = actions.filter(action => action.plantId === plant._id).map(action => action.date);
    if (dates.length) {
        dates.sort().reduce((a, b) => {
            intervals.push(calculateTimeDiff(b, a));
            return b;
        });
    }
    return intervals.reverse();
};

const schedules = data
    .find(obj => obj.collectionName === 'schedules')
    .docs.map(schedule => ({ id: schedule._id, interval: schedule.daysInterval }));

const allPlants = data
    .find(obj => obj.collectionName === 'plants')
    .docs.filter(plant => !plant.isDeleted)
    .map(plant => ({
        ...plant,
        interval: schedules.find(schedule => schedule.id === plant.scheduleId)?.interval || 0,
        wateringDiff: plant.nextWateringDate ? calculateTimeDiff(plant.nextWateringDate) : null,
        prevIntervals: getPrevIntervals(plant),
    }));*/

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    //allPlants,
    //calculateTimeDiff,
};
