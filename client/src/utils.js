import plantData from './vera-export/data.json';

const calculateTimeDiff = seconds => Math.round((seconds - Date.now() / 1000) / (3600 * 24));

const schedules = plantData
    .find(obj => obj.collectionName === 'schedules')
    .docs.map(schedule => ({ id: schedule.id, interval: schedule.daysInterval }));

export const allPlants = plantData
    .find(obj => obj.collectionName === 'plants')
    .docs.filter(plant => !plant.isDeleted)
    .map(plant => ({
        ...plant,
        interval: schedules.find(schedule => schedule.id === plant.scheduleId).interval,
        watering: calculateTimeDiff(plant.nextWateringDate._seconds),
    }));
