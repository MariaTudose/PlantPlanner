import React, { useCallback, useEffect, useState } from 'react';
import PlantModal from './PlantModal';
import { getPhotoSrc, setPlaceholder } from './utils';

import './style.scss';

const PlantGrid = ({ plants }) => {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [visibility, setVisibility] = useState(false);

    const scrollPlant = useCallback(
        i => {
            const n = plants.length;
            const iCur = plants.indexOf(selectedPlant) + i;
            const iNext = ((iCur % n) + n) % n;
            setSelectedPlant(plants[iNext]);
        },
        [plants, selectedPlant]
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

    return (
        <div id="plant-grid">
            <PlantModal plant={selectedPlant} visibility={visibility} closeModal={() => setVisibility(false)} />
            {plants
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(plant => (
                    <button
                        key={plant.id}
                        className="plant-card"
                        onClick={() => {
                            setSelectedPlant(plant);
                            setVisibility(true);
                        }}
                    >
                        <span>{plant.interval}</span>
                        <img
                            className="plant-pic"
                            src={getPhotoSrc(plant)}
                            onError={setPlaceholder}
                            alt={plant.name}
                        ></img>
                        <span>{plant.name}</span>
                    </button>
                ))}
        </div>
    );
};

export default PlantGrid;
