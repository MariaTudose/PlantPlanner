import { useState } from 'react';

import { Plant } from '../../types';

import { getPhotoSrc } from './utils';
import placeholder from './placeholder.webp';

import './style.scss';

const PlantPic = ({ plant }: { plant: Plant | null }) => {
    const [erroredPlants, setErroredPlants] = useState<string[]>([]);

    const setPlantError = (id: string) => {
        setErroredPlants(erroredPlants.concat(id));
    };

    if (!plant) return null;

    return (
        <img
            className="plant-pic"
            src={!erroredPlants.includes(plant.id) ? getPhotoSrc(plant.pictures) : placeholder}
            onError={() => setPlantError(plant.id)}
            alt={plant.name}
            width="500"
            height="500"
        />
    );
};

export default PlantPic;
