import React, { useContext, useState } from 'react';

import { PlantContext } from '../App';

import ScheduleCard from './ScheduleCard';
import { groupPlants } from './utils';

import './style.scss';

const Schedule = () => {
    const [selectedDay, setSelectedDay] = useState(null);
    const { plants } = useContext(PlantContext);
    const groupedPlants = groupPlants(plants);

    return (
        <main id="schedule">
            {Object.entries(groupedPlants)
                .sort((a, b) => a[0] - b[0])
                .map(([day, plantsByDay]) => (
                    <ScheduleCard
                        key={day}
                        day={day}
                        plants={plantsByDay}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                    />
                ))}
        </main>
    );
};

export default Schedule;
