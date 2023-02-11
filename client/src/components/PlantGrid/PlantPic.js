import React, { useState } from 'react';
import { getPhotoSrc } from './utils';
import placeholder from './placeholder.webp';

import './style.scss';

const PlantPic = ({ plant }) => {
    const [erroredPlants, setErroredPlants] = useState([]);

    const setPlantError = id => {
        setErroredPlants(erroredPlants.concat(id));
    };

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
