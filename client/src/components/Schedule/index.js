import React from 'react';
import './main.scss';
import PlantGrid from '../PlantGrid';

const ScheduleCard = ({ day, plants }) => {
    const dayForm = day < -1 || day > 1 ? 'days' : 'day';
    let title = `In ${day} ${dayForm}`;
    if (day === '0') title = 'Today';
    else if (day < '0') title = `${Math.abs(day)} ${dayForm} overdue`;

    return (
        <div className="schedule-card">
            <p className="title">{title}</p>
            <PlantGrid plants={plants} />
        </div>
    );
};

const Schedule = ({ plants }) => {
    const groupedPlants = plants.reduce(
        (res, plant) => ({
            ...res,
            [plant.watering]: [...(res[plant.watering] || []), plant],
        }),
        {}
    );

    return (
        <div id="schedule">
            {Object.entries(groupedPlants)
                .sort((a, b) => a[0] - b[0])
                .map(([day, plants]) => (
                    <ScheduleCard key={day} day={day} plants={plants} />
                ))}
        </div>
    );
};

export default Schedule;
