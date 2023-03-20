import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as Done } from '../../static/done.svg';
import PlantModal from './PlantModal';
import PlantPic from './PlantPic';

import './style.scss';

interface PlantGridProps {
    plants: Array<Plant>;
    selectPlant?: ((plant: Plant) => void) | null;
    selectedPlants?: Array<Plant>;
}

const PlantGrid = ({ plants, selectPlant, selectedPlants }: PlantGridProps) => {
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [visibility, setVisibility] = useState(false);
    const sortedPlants = [...plants].sort((a, b) =>
        a.location === b.location ? a.name.localeCompare(b.name) : a.location.localeCompare(b.location)
    );

    const closeModal = () => {
        setVisibility(false);
        setTimeout(() => {
            setSelectedPlant(null);
        }, 300);
    };

    const scrollPlant = useCallback(
        (i: number) => {
            if (selectedPlant) {
                const n = sortedPlants.length;
                const iCur = sortedPlants.indexOf(selectedPlant) + i;
                const iNext = ((iCur % n) + n) % n;
                setSelectedPlant(sortedPlants[iNext]);
            }
        },
        [sortedPlants, selectedPlant]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const { key } = event;
            if (selectedPlant) {
                if (key === 'ArrowLeft') scrollPlant(-1);
                else if (key === 'ArrowRight') scrollPlant(1);
                else if (key === 'Escape') closeModal();
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

    const groupedPlants = sortedPlants.reduce((res: Record<string, Array<Plant>>, plant) => {
        (res[plant.location] = res[plant.location] || []).push(plant);
        return res;
    }, {});

    return (
        <div className={`plant-card ${selectPlant ? 'select-mode' : ''} `}>
            <PlantModal plant={selectedPlant} visibility={visibility} closeModal={closeModal} />
            {Object.entries(groupedPlants).map(([location, plants]) => (
                <section className="plant-grid" key={location}>
                    <h4 className="location">{location}</h4>
                    {plants.map(plant => (
                        <button
                            key={plant.id}
                            className={`plant-card 
                                ${selectPlant && selectedPlants?.includes(plant) ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedPlant(plant);
                                selectPlant ? selectPlant(plant) : setVisibility(true);
                            }}
                        >
                            <Done className="plant-select-icon" />
                            <span className="plant-interval" title="Watering interval">
                                {plant.interval}
                            </span>
                            <PlantPic plant={plant} />
                            <div className="plant-name-container">
                                <span className="plant-name">{plant.name}</span>
                            </div>
                        </button>
                    ))}
                </section>
            ))}
        </div>
    );
};

export default PlantGrid;
