import React, { useContext, useState } from 'react';
import { add, parseISO } from 'date-fns';

import { ReactComponent as Drink } from '../../static/drink.svg';
import { ReactComponent as Drop } from '../../static/drop.svg';
import { ReactComponent as Today } from '../../static/today.svg';
import { updatePlants } from '../../services/plants';
import { createActions } from '../../services/actions';

import { PlantContext } from '../App';
import PlantGrid from '../PlantGrid';

import { groupPlants } from './utils';

import './style.scss';

const ActionPopup = ({ visible, selectedPlants }) => {
    const { setPlants } = useContext(PlantContext);

    const waterPlants = () => {
        const currentDate = new Date();
        const plantBody = selectedPlants.map(plant => ({
            id: plant.id,
            lastWateringDate: currentDate,
            nextWateringDate: add(currentDate, { days: plant.interval }),
        }));
        const actionBody = selectedPlants.map(plant => ({ plantId: plant.id, action: 'water', date: currentDate }));

        updatePlants(plantBody).then(updatedPlants => {
            setPlants(updatedPlants);
            createActions(actionBody);
        });
    };

    // Always move watering date in relation to next watering date unless watering is overdue
    const moveWatering = i => {
        const plantBody = selectedPlants.map(plant => ({
            id: plant.id,
            lastWateringDate: plant.lastWateringDate,
            nextWateringDate: i === 0 ? new Date() : add(parseISO(plant.nextWateringDate), { days: i }),
        }));
        updatePlants(plantBody).then(updatedPlants => {
            setPlants(updatedPlants);
        });
    };

    return (
        <div className={`action-popup ${visible ? 'visible' : ''}`}>
            <div className={'action-content'}>
                <button className="icon-button" onClick={waterPlants}>
                    <Drop />
                </button>
                <button className="icon-button" onClick={() => moveWatering(0)}>
                    <Today />
                </button>
                <button onClick={() => moveWatering(1)}>+1</button>
                <button onClick={() => moveWatering(3)}>+3</button>
                <button onClick={() => moveWatering(7)}>+7</button>
            </div>
        </div>
    );
};

const ScheduleCard = ({ day, plants, selectedDay, setSelectedDay }) => {
    const [selectedPlants, setSelectedPlants] = useState([]);

    const dayForm = day < -1 || day > 1 ? 'days' : 'day';
    let title = `In ${day} ${dayForm}`;
    if (day === '0') title = 'Today';
    else if (day < '0') title = `${Math.abs(day)} ${dayForm} overdue`;

    const selectPlant = newPlant => {
        if (selectedPlants.includes(newPlant)) setSelectedPlants(selectedPlants.filter(plant => plant !== newPlant));
        else setSelectedPlants([...selectedPlants, newPlant]);
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
                <span className="title">{title}</span>
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
