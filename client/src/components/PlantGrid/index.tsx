import { useCallback, useContext, useEffect } from 'react';
import { ReactComponent as Done } from '../../static/done.svg';
import PlantPic from './PlantPic';

import './style.scss';
import { PlantContext, PlantContextProps } from '../App';

interface PlantGridProps {
    plants: Array<Plant>;
    selectPlant?: ((plant: Plant) => void) | null;
    selectedPlants?: Array<Plant>;
}

const PlantGrid = ({ plants, selectPlant, selectedPlants }: PlantGridProps) => {
    const { selectedPlant, setSelectedPlant, togglePlantModal } = useContext(PlantContext) as PlantContextProps;
    const sortedPlants = [...plants].sort((a, b) =>
        a.location === b.location ? a.name.localeCompare(b.name) : a.location.localeCompare(b.location)
    );

    const scrollPlant = useCallback(
        (i: number) => {
            const plantIndex = sortedPlants.findIndex(plant => plant.id === selectedPlant?.id);
            if (selectedPlant && plantIndex >= 0) {
                const n = sortedPlants.length;
                const iNext = (((plantIndex + i) % n) + n) % n;
                setSelectedPlant(sortedPlants[iNext]);
            }
        },
        [selectedPlant, sortedPlants, setSelectedPlant]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const { key } = event;
            if (selectedPlant) {
                if (key === 'ArrowLeft') scrollPlant(-1);
                else if (key === 'ArrowRight') scrollPlant(1);
                else if (key === 'Escape') togglePlantModal();
            }
        },
        [togglePlantModal, scrollPlant, selectedPlant]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const groupedPlants = sortedPlants.reduce((res: Record<string, Array<Plant>>, plant) => {
        (res[plant.location] = res[plant.location] || []).push(plant);
        return res;
    }, {});

    return (
        <div className={`plant-card ${selectPlant ? 'select-mode' : ''} `}>
            {Object.entries(groupedPlants).map(([location, plants]) => (
                <section className="plant-grid" key={location}>
                    <h4 className="location">{location}</h4>
                    {plants.map(plant => (
                        <button
                            key={plant.id}
                            className={`plant-card 
                                ${selectPlant && selectedPlants?.includes(plant) ? 'selected' : ''}`}
                            onClick={() => {
                                if (selectPlant) selectPlant(plant);
                                else {
                                    setSelectedPlant(plant);
                                    togglePlantModal();
                                }
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
