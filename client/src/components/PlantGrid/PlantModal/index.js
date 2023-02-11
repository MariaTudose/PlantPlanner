import React, { useContext, useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

import { updatePlant } from '../../../services/plants';
import { PlantContext } from '../../App';
import PlantPic from '../PlantPic';
import { getPrevIntervals, weightedAvg } from '../utils';

import './style.scss';

const PlantModal = ({ plant, visibility, closeModal }) => {
    const [nextWateringDate, setNextWateringDate] = useState(new Date());
    const [interval, setInterval] = useState(0);
    const [location, setLocation] = useState('');
    const [intervals, setIntervals] = useState([]);
    const { plants, setPlants } = useContext(PlantContext);

    useEffect(() => {
        if (plant?.id) getPrevIntervals(plant.id).then(intervals => setIntervals(intervals));
    }, [plant]);

    useEffect(() => {
        if (plant && plant.nextWateringDate) {
            setNextWateringDate(format(parseISO(plant.nextWateringDate), 'yyyy-MM-dd'));
            setInterval(plant.interval);
            setLocation(plant.location);
        }
    }, [plant]);

    const onSubmit = e => {
        e.preventDefault();
        const body = { nextWateringDate, interval, location };
        updatePlant(plant.id, body).then(updatedPlant =>
            setPlants(plants.map(plant => (plant.id === updatedPlant.id ? updatedPlant : plant)))
        );

        closeModal();
    };

    return (
        <div id="plant-modal" className={`${visibility ? 'visible' : ''}`}>
            <button type="button" className="modal-backdrop" onClick={closeModal} />
            {plant && (
                <form className="modal-content" onSubmit={onSubmit}>
                    <div className="plant-pic-container">
                        <PlantPic plant={plant} />
                        <div className="plant-pic-overlay">
                            <h1>{plant.name}</h1>
                            <i>{plant.userEnteredPlantType}</i>
                        </div>
                    </div>
                    <div className="plant-info">
                        <label>
                            <span>Next Watering date: </span>
                            <input
                                type="date"
                                name="watering"
                                value={nextWateringDate}
                                onChange={e => setNextWateringDate(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Interval: </span>
                            <input
                                className="interval-input"
                                type="number"
                                name="interval"
                                value={interval}
                                onChange={e => setInterval(e.target.value)}
                            />
                            <span> days</span>
                        </label>
                        {intervals && (
                            <>
                                <p>Calculated interval: {weightedAvg(intervals).toFixed(1)} days</p>
                                <p>Prev intervals: {intervals.slice(0, 10).join(', ')}</p>
                            </>
                        )}
                        <label>
                            <span>Location: </span>
                            <input
                                className="location-input"
                                type="string"
                                name="location"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            ></input>
                        </label>
                    </div>
                    <div className="plant-actions">
                        <button>Water</button>
                        <button>+1 days</button>
                        <button>+2 days</button>
                        <button type="submit">Confirm</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PlantModal;
