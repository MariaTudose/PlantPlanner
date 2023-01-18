import React, { useCallback, useEffect, useState } from 'react';
import PlantModal from './PlantModal';
import { getPhotoSrc, setPlaceholder } from './utils';
import { ReactComponent as Done } from '../../static/done.svg';

import './style.scss';

const PlantGrid = ({ plants, selectPlant, selectedPlants }) => {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [visibility, setVisibility] = useState(false);
    const sortedPlants = plants.sort((a, b) =>
        a.location === b.location ? a.name.localeCompare(b.name) : a.location.localeCompare(b.location)
    );

    const scrollPlant = useCallback(
        i => {
            const n = sortedPlants.length;
            const iCur = sortedPlants.indexOf(selectedPlant) + i;
            const iNext = ((iCur % n) + n) % n;
            setSelectedPlant(sortedPlants[iNext]);
        },
        [sortedPlants, selectedPlant]
    );

    const handleKeyDown = useCallback(
        event => {
            const { keyCode } = event;
            if (selectedPlant) {
                if (keyCode === 37) scrollPlant(-1);
                else if (keyCode === 39) scrollPlant(1);
                else if (keyCode === 27) setVisibility(false);
            }
        },
        [scrollPlant, selectedPlant]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedPlant, handleKeyDown]);

    const groupedPlants = sortedPlants.reduce(
        (res, plant) => ({
            ...res,
            [plant.location]: [...(res[plant.location] || []), plant],
        }),
        {}
    );

    return (
        <div id="plant-grid">
            <PlantModal plant={selectedPlant} visibility={visibility} closeModal={() => setVisibility(false)} />
            {Object.entries(groupedPlants).map(([location, plants]) => (
                <React.Fragment key={location}>
                    <div className="location">{location}</div>
                    {plants
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(plant => (
                            <button
                                key={plant.id}
                                className={`plant-card 
                                ${selectPlant ? 'select-mode' : ''} 
                                ${selectPlant && selectedPlants.includes(plant) ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedPlant(plant);
                                    selectPlant ? selectPlant(plant) : setVisibility(true);
                                }}
                            >
                                <Done />
                                <span>{plant.interval}</span>
                                <img
                                    className="plant-pic"
                                    src={getPhotoSrc(plant)}
                                    onError={setPlaceholder}
                                    alt={plant.name}
                                    width="500"
                                    height="500"
                                ></img>
                                <span>{plant.name}</span>
                            </button>
                        ))}
                </React.Fragment>
            ))}
        </div>
    );
};

export default PlantGrid;
