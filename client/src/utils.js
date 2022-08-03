import plantData from './vera-export/formattedData.json';

const calculateTimeDiff = seconds => Math.round((new Date(seconds) - Date.now()) / (1000 * 3600 * 24));

const schedules = plantData
    .find(obj => obj.collectionName === 'schedules')
    .docs.map(schedule => ({ id: schedule._id, interval: schedule.daysInterval }));

export const allPlants = plantData
    .find(obj => obj.collectionName === 'plants')
    .docs.filter(plant => !plant.isDeleted)
    .map(plant => ({
        ...plant,
        interval: schedules.find(schedule => schedule.id === plant.scheduleId)?.interval || 0,
        wateringDiff: plant.nextWateringDate ? calculateTimeDiff(plant.nextWateringDate) : null,
    }));
