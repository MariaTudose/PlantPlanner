import React from 'react';
import './main.scss';
import plantData from '../../vera-export/data.json';
import PlantGrid from '../PlantGrid';

const calculateTimeDiff = seconds => Math.round((seconds - Date.now() / 1000) / (3600 * 24));

const schedules = plantData
    .find(obj => obj.collectionName === 'schedules')
    .docs.map(schedule => ({ id: schedule.id, interval: schedule.daysInterval }));

const plants = plantData
    .find(obj => obj.collectionName === 'plants')
    .docs.filter(plant => !plant.isDeleted)
    .map(plant => ({
        ...plant,
        interval: schedules.find(schedule => schedule.id === plant.scheduleId).interval,
        watering: calculateTimeDiff(plant.nextWateringDate._seconds),
    }));

const groupedPlants = plants.reduce(
    (res, plant) => ({
        ...res,
        [plant.watering]: [...(res[plant.watering] || []), plant],
    }),
    {}
);

const ScheduleCard = ({ days }) => {
    let title = `In ${days} days`;
    if (days === '0') title = 'Today';
    else if (days < '0') title = `${Math.abs(days)} days overdue`;

    return (
        <div key={days} className="schedule-card">
            <p className="title">{title}</p>
            <PlantGrid plants={groupedPlants[days]} />
        </div>
    );
};

const Schedule = () => {
    return (
        <div id="schedule">
            {Object.keys(groupedPlants)
                .sort((a, b) => a - b)
                .map(days => (
                    <ScheduleCard days={days} />
                ))}
        </div>
    );
};

export default Schedule;
