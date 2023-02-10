import React, { useContext, useState } from 'react';

import { PlantContext } from '../App';

import ScheduleCard from './ScheduleCard';
import { groupPlants } from './utils';

import './style.scss';

const Schedule = () => {
    const { plants } = useContext(PlantContext);
    const [selectedDay, setSelectedDay] = useState(null);

    return (
        <div id="schedule">
            {Object.entries(groupPlants(plants))
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
        </div>
    );
};

export default Schedule;
