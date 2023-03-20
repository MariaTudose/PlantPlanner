import { FormEvent, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { updatePlant } from '../../../services/plants';
import { PlantContextProps, PlantContext } from '../../App';
import PlantPic from '../PlantPic';
import { getPrevIntervals, weightedAvg } from '../utils';

import './style.scss';

interface PlantModalProps {
    plant: Plant | null;
    visibility: boolean;
    closeModal: () => void;
}

const PlantModal = ({ plant, visibility, closeModal }: PlantModalProps) => {
    const [nextWateringDate, setNextWateringDate] = useState<Date>(new Date());
    const [interval, setInterval] = useState('0');
    const [location, setLocation] = useState('');
    const [intervals, setIntervals] = useState<Array<number>>([]);
    const { plants, setPlants } = useContext(PlantContext) as PlantContextProps;

    useEffect(() => {
        if (plant?.id) getPrevIntervals(plant.id).then(intervals => setIntervals(intervals));
    }, [plant]);

    useEffect(() => {
        if (plant && plant.nextWateringDate) {
            setNextWateringDate(plant.nextWateringDate);
            setInterval(plant.interval);
            setLocation(plant.location);
        }
    }, [plant]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (plant) {
            const body = { nextWateringDate, interval, location };
            updatePlant(plant.id, body).then(updatedPlant =>
                setPlants(plants.map(plant => (plant.id === updatedPlant.id ? updatedPlant : plant)))
            );

            closeModal();
        }
    };

    return (
        <div id="plant-modal" className={`${visibility ? 'visible' : ''}`}>
            <button type="button" className="modal-backdrop" aria-label="Close modal" onClick={closeModal} />
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
                                value={format(nextWateringDate, 'yyyy-MM-dd')}
                                onChange={e => setNextWateringDate(new Date(e.target.value))}
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
