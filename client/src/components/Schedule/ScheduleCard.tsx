import { useState } from 'react';

import Today from '../../static/today.svg?react';
import Drink from '../../static/drink.svg?react';
import { SelectMode } from '../../enums';
import { Plant } from '../../types';

import PlantGrid from '../PlantGrid';
import ActionPopup from './ActionPopup';

interface ScheduleCardProps {
    day: number;
    plants: Plant[];
    selectedDay: number | null;
    setSelectedDay: (value: number | null) => void;
}

const ScheduleCard = ({ day, plants, selectedDay, setSelectedDay }: ScheduleCardProps) => {
    const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
    const [selectMode, setSelectMode] = useState<SelectMode | null>(null);

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

    const toggleSelectMode = (newSelectMode: SelectMode) => {
        setSelectedDay(day);
        setSelectMode(newSelectMode);
        if (selectedDay === day && newSelectMode === selectMode) setSelectedDay(null);
    };

    return (
        <section className="">
            <h2 className="title">{title}</h2>
            <div className="schedule-card">
                <header className="card-header">
                    <h3 className="plant-amount">{plants.length} plants</h3>
                    {selectedDay === day && (
                        <button onClick={toggleAllPlants} className="select-button">
                            Select all
                        </button>
                    )}
                    <button
                        aria-label="date-mode"
                        onClick={() => toggleSelectMode(SelectMode.DATE)}
                        className={`date-button ${
                            selectMode === SelectMode.DATE && selectedDay === day ? 'selecting' : ''
                        }`}
                    >
                        <Today />
                    </button>
                    <button
                        aria-label="water-mode"
                        onClick={() => toggleSelectMode(SelectMode.WATER)}
                        className={`water-button ${
                            selectMode === SelectMode.WATER && selectedDay === day ? 'selecting' : ''
                        }`}
                    >
                        <Drink />
                    </button>
                </header>
                <PlantGrid
                    plants={plants}
                    selectPlant={selectedDay === day ? selectPlant : null}
                    selectedPlants={selectedPlants}
                />
                <ActionPopup
                    visible={selectedDay === day}
                    selectedPlants={selectedPlants}
                    setSelectedPlants={setSelectedPlants}
                    selectMode={selectMode}
                />
            </div>
        </section>
    );
};

export default ScheduleCard;
