import React from 'react';
import './style.scss';
import placeholder from './placeholder.jpg';

const getPhotoSrc = plant =>
    plant.pictures.length ? `${process.env.REACT_APP_API_URL}images/${plant.pictures[0]}.jpg` : placeholder;

const setPlaceholder = e => {
    e.onError = null;
    e.target.src = placeholder;
};

const PlantGrid = ({ plants }) => (
    <div id="plant-grid">
        {plants.map(plant => (
            <button key={plant.id} className="plant-card">
                <span>{plant.interval}</span>
                <img className="plant-pic" src={getPhotoSrc(plant)} onError={setPlaceholder} alt={plant.name}></img>
                <span>{plant.name}</span>
            </button>
        ))}
    </div>
);

export default PlantGrid;
