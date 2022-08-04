import React from 'react';
import { getPhotoSrc, setPlaceholder } from '../utils';

import './style.scss';

const PlantModal = ({ plant, visibility, closeModal }) => (
    <div id="plant-modal" className={`${visibility ? 'visible' : ''}`} onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img className="plant-pic" src={getPhotoSrc(plant)} onError={setPlaceholder} alt={plant?.name}></img>
            <div className="plant-info">
                <h1>{plant?.name}</h1>
                <p>{plant?.userEnteredPlantType}</p>
                <p>Interval: {plant?.interval} days</p>
                <p>Calculated interval: # days</p>
                <p>Next Watering date: {plant?.nextWateringDate}</p>
            </div>
            <div className="plant-actions">
                <button>Water</button>
                <button>+1 days</button>
                <button>+2 days</button>
            </div>
        </div>
    </div>
);

export default PlantModal;
