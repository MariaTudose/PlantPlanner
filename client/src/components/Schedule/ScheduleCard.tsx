import { useState } from 'react';
import { ReactComponent as Drink } from '../../static/drink.svg';
import PlantGrid from '../PlantGrid';
import ActionPopup from './ActionPopup';

interface ScheduleCardProps {
    day: number;
    plants: Array<Plant>;
    selectedDay: number | null;
    setSelectedDay: (value: number | null) => void;
}

const ScheduleCard = ({ day, plants, selectedDay, setSelectedDay }: ScheduleCardProps) => {
    const [selectedPlants, setSelectedPlants] = useState<Array<Plant>>([]);

    const dayForm = day < -1 || day > 1 ? 'days' : 'day';
    let title = `In ${day} ${dayForm}`;
    if (day === 0) title = 'Today';
    else if (day < 0) title = `${Math.abs(day)} ${dayForm} overdue`;

    const selectPlant = (newPlant: Plant) => {
        if (selectedPlants.includes(newPlant)) setSelectedPlants(selectedPlants.filter(plant => plant !== newPlant));
        else setSelectedPlants(selectedPlants.concat(newPlant));
    };

    const toggleAllPlants = () => {
        if (selectedPlants.length === plants.length) setSelectedPlants([]);
        else setSelectedPlants(plants);
    };

    const toggleWaterMode = () => {
        setSelectedPlants([]);
        if (selectedDay === day) setSelectedDay(null);
        else setSelectedDay(day);
    };

    return (
        <section className="schedule-card">
            <header className="card-header">
                <h3 className="title">{title}</h3>
                {selectedDay === day && (
                    <button onClick={toggleAllPlants} className="select-button">
                        Select all
                    </button>
                )}
                <button
                    aria-label="water-mode"
                    onClick={toggleWaterMode}
                    className={`water-button ${selectedDay === day ? 'watering' : ''}`}
                >
                    <Drink />
                </button>
            </header>
            <PlantGrid
                plants={plants}
                selectPlant={selectedDay === day ? selectPlant : null}
                selectedPlants={selectedPlants}
            />
            <ActionPopup visible={selectedDay === day} selectedPlants={selectedPlants} />
        </section>
    );
};

export default ScheduleCard;
