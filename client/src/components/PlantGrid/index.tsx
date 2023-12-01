import { useContext } from 'react';
import { differenceInDays } from 'date-fns';

import Done from '../../static/done.svg?react';
import Hungry from '../../static/hungry.svg?react';
import { PlantContext, PlantContextProps } from '../App';
import PlantPic from './PlantPic';

import './style.scss';

const JUNE = 5;
const AUGUST = 7;

interface PlantGridProps {
    plants: Plant[];
    selectPlant?: ((plant: Plant) => void) | null;
    selectedPlants?: Plant[];
}

const PlantGrid = ({ plants, selectPlant, selectedPlants }: PlantGridProps) => {
    const { openModal } = useContext(PlantContext) as PlantContextProps;
    const sortedPlants = [...plants].sort((a, b) =>
        a.location === b.location ? a.name.localeCompare(b.name) : a.location.localeCompare(b.location)
    );

    const groupedPlants = sortedPlants.reduce((res: Record<string, Plant[]>, plant) => {
        (res[plant.location] = res[plant.location] || []).push(plant);
        return res;
    }, {});

    const isHungry = (lastFertilizingDate: Date | null) => {
        const currentMonth = new Date().getMonth();
        if (JUNE > currentMonth || currentMonth > AUGUST) return false;
        if (!lastFertilizingDate) return true;
        const diff = differenceInDays(new Date(), lastFertilizingDate);
        return diff >= 28;
    };

    return (
        <div className={`plant-grid-container ${selectPlant ? 'select-mode' : ''} `}>
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
                                else openModal(sortedPlants, sortedPlants.indexOf(plant) + 1);
                            }}
                        >
                            <Done className="plant-indicator plant-select appearing-indicator" />
                            <span className="plant-indicator plant-interval" title="Watering interval">
                                {plant.interval}
                            </span>
                            <Hungry
                                className={`plant-indicator plant-hungry appearing-indicator ${
                                    isHungry(plant.lastFertilizingDate) ? 'visible' : ''
                                }`}
                            />
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
