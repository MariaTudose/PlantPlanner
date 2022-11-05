import React, { useState } from 'react';
import PlantGrid from '../PlantGrid';
import { ReactComponent as Drink } from '../../static/drink.svg';
import { getAllPlants, updatePlant } from '../../services/plants';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';

import './style.scss';

const ActionPopup = ({ visible, selectedPlants }) => {
    const waterPlant = () => {
        selectedPlants.forEach(plant => {
            // TODO: create watering action
            moveWatering(plant.interval);
        });
    };

    const moveWatering = i => {
        selectedPlants.forEach(plant => {
            const cur = new Date();
            const newDate = cur.setDate(cur.getDate() + i);
            onUpdatePlant(plant, format(newDate, 'yyyy-MM-dd'));
        });
    };

    const onUpdatePlant = (plant, date) => {
        const body = { nextWateringDate: new Date(date) };
        updatePlant(plant.id, body);
        getAllPlants();
        window.location.reload(); // temp
    };

    return (
        <div className={`action-popup ${visible ? 'visible' : ''}`}>
            <div className={'action-content'}>
                <button onClick={waterPlant}>Water</button>
                <button onClick={() => moveWatering(2)}>+2</button>
                <button onClick={() => moveWatering(2)}>+7</button>
            </div>
        </div>
    );
};

const ScheduleCard = ({ day, plants }) => {
    const [waterMode, setWaterMode] = useState(false);
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
        if (waterMode) setSelectedPlants([]);
        setWaterMode(!waterMode);
    };

    return (
        <div className="schedule-card">
            <div className="card-header">
                <span className="title">{title}</span>
                {waterMode && (
                    <button onClick={toggleAllPlants} className="select-button">
                        Select all
                    </button>
                )}
                <button onClick={toggleWaterMode} className={`water-button ${waterMode ? 'watering' : ''}`}>
                    <Drink />
                </button>
            </div>
            <PlantGrid plants={plants} selectPlant={waterMode ? selectPlant : null} selectedPlants={selectedPlants} />
            <ActionPopup visible={waterMode} selectedPlants={selectedPlants} />
        </div>
    );
};

const Schedule = ({ plants }) => {
    const groupedPlants = plants
        .map(plant => ({
            ...plant,
            wateringDiff: plant.nextWateringDate
                ? differenceInCalendarDays(parseISO(plant.nextWateringDate), Date.now())
                : null,
        }))
        .filter(plant => plant.wateringDiff !== null)
        .reduce(
            (res, plant) => ({
                ...res,
                [plant.wateringDiff]: [...(res[plant.wateringDiff] || []), plant],
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
