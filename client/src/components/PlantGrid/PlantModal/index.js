import React from 'react';
import { getPhotoSrc, setPlaceholder } from '../utils';

import './style.scss';

const weightedAvg = intervals =>
    [0.7, 0.2, 0.1].reduce((acc, weight, i) => {
        return acc + intervals[i] * weight;
    }, 0) || 0;

const PlantModal = ({ plant, visibility, closeModal }) => (
    <div id="plant-modal" className={`${visibility ? 'visible' : ''}`}>
        <button type="button" className="modal-backdrop" onClick={closeModal} />
        {plant && (
            <div className="modal-content">
                <img className="plant-pic" src={getPhotoSrc(plant)} onError={setPlaceholder} alt={plant.name}></img>
                <div className="plant-info">
                    <h1>{plant.name}</h1>
                    <p>{plant.userEnteredPlantType}</p>
                    <p>Interval: {plant.interval} days</p>
                        {/*
                    <p>Calculated interval: {weightedAvg(plant.prevIntervals).toFixed(1)} days</p>
                    <p>Prev intervals: {plant.prevIntervals.slice(0, 10).join(', ')}</p>
                        */}
                    <p>Next Watering date: {plant.nextWateringDate}</p>
                </div>
                <div className="plant-actions">
                    <button>Water</button>
                    <button>+1 days</button>
                    <button>+2 days</button>
                </div>
            </div>
        )}
    </div>
);

export default PlantModal;
