import React from 'react';
import './style.scss';

const PlantGrid = ({ plants }) => (
    <div id="plant-grid">
        {plants.map(plant => (
            <button key={plant.id} className="plant-card">
                <span>{plant.interval}</span>
                <img
                    className="plant-pic"
                    src={
                        plant.pictures.length
                            ? require(`../../vera-export/images/${plant.pictures[0]}.jpg`)
                            : require('../../vera-export/images/placeholder.png')
                    }
                    alt={plant.name}
                ></img>
                <span>{plant.name}</span>
            </button>
        ))}
    </div>
);

export default PlantGrid;
