import { useContext, useState } from 'react';

import { PlantContextProps, PlantContext } from '../App';

import ScheduleCard from './ScheduleCard';
import { groupPlants } from './utils';

import './style.scss';

const Schedule = () => {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const { plants } = useContext(PlantContext) as PlantContextProps;
    const groupedPlants = groupPlants(plants);

    return (
        <main id="schedule">
            {Object.entries(groupedPlants)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([day, plantsByDay]) => (
                    <ScheduleCard
                        key={day}
                        day={Number(day)}
                        plants={plantsByDay}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                    />
                ))}
        </main>
    );
};

export default Schedule;
