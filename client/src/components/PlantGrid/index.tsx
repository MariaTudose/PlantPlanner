import { useContext } from 'react';
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
    const { openModal } = useContext(PlantContext) as PlantContextProps;
    const sortedPlants = [...plants].sort((a, b) =>
        a.location === b.location ? a.name.localeCompare(b.name) : a.location.localeCompare(b.location)
    );

    const groupedPlants = sortedPlants.reduce((res: Record<string, Array<Plant>>, plant) => {
        (res[plant.location] = res[plant.location] || []).push(plant);
        return res;
    }, {});

    return (
        <div className={`plant-card ${selectPlant ? 'select-mode' : ''} `}>
            {Object.entries(groupedPlants).map(([location, plants]) => (
                <section className="plant-grid" key={location}>
                    <h4 className="location">{location}</h4>
                    {plants.map((plant, i) => (
                        <button
                            key={plant.id}
                            className={`plant-card 
                                ${selectPlant && selectedPlants?.includes(plant) ? 'selected' : ''}`}
                            onClick={() => {
                                if (selectPlant) selectPlant(plant);
                                else openModal(sortedPlants, i + 1);
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
