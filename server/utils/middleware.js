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

const data = require('../build/formattedData.json');

const calculateTimeDiff = seconds => Math.round((new Date(seconds) - Date.now()) / (1000 * 3600 * 24));

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
        wateringDay: new Date(plant.nextWateringDate),
    }));

module.exports = {
    requestLogger,
    unknownEndpoint,
    allPlants,
};
