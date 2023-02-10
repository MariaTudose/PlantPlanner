import { useState } from 'react';
import { ReactComponent as Drink } from '../../static/drink.svg';
import PlantGrid from '../PlantGrid';
import ActionPopup from './ActionPopup';

const ScheduleCard = ({ day, plants, selectedDay, setSelectedDay }) => {
    const [selectedPlants, setSelectedPlants] = useState([]);

    const dayForm = day < -1 || day > 1 ? 'days' : 'day';
    let title = `In ${day} ${dayForm}`;
    if (day === '0') title = 'Today';
    else if (day < '0') title = `${Math.abs(day)} ${dayForm} overdue`;

    const selectPlant = newPlant => {
        if (selectedPlants.includes(newPlant)) setSelectedPlants(selectedPlants.filter(plant => plant !== newPlant));
        else setSelectedPlants(selectedPlants.concat(newPlant));
    };

    const toggleAllPlants = () => {
        if (selectedPlants.length === plants.length) setSelectedPlants([]);
        else setSelectedPlants(plants);
    };

    const toggleWaterMode = () => {
        if (selectedDay === day) setSelectedDay(null);
        else setSelectedDay(day);
    };

    return (
        <div className="schedule-card">
            <div className="card-header">
                <h4 className="title">{title}</h4>
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
            </div>
            <PlantGrid
                plants={plants}
                selectPlant={selectedDay === day ? selectPlant : null}
                selectedPlants={selectedPlants}
            />
            <ActionPopup visible={selectedDay === day} selectedPlants={selectedPlants} />
        </div>
    );
};

export default ScheduleCard;
