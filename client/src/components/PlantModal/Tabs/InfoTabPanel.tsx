import { addDays, format } from 'date-fns';
import { useState, useEffect, FormEvent } from 'react';
import { getActions } from '../../../services/actions';
import { updatePlant } from '../../../services/plants';
import { parseActions, weightedAvg } from '../utils';
import './style.scss';

interface InfoTabPanelProps {
    active: boolean;
    plant: Plant;
    closeModal: () => void;
    updatePlants: (plant: Plant) => void;
    nextWateringDate: Date;
    setNextWateringDate: (date: Date) => void;
}

const InfoTabPanel = ({
    active,
    plant,
    closeModal,
    updatePlants,
    nextWateringDate,
    setNextWateringDate,
}: InfoTabPanelProps) => {
    const [interval, setInterval] = useState(plant.interval);
    const [location, setLocation] = useState(plant.location);
    const [intervals, setIntervals] = useState<Array<number>>([]);

    useEffect(() => {
        setInterval(plant.interval);
        setLocation(plant.location);
        getActions(plant.id).then(actions => {
            setIntervals(parseActions(actions));
        });
    }, [plant]);

    const updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if (!newDate.getTime()) return null;
        else setNextWateringDate(newDate);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const body = { nextWateringDate, interval, location };
        updatePlant(plant.id, body).then(updatedPlant => updatePlants(updatedPlant));
        closeModal();
    };
    return (
        <form className={`plant-info ${active ? 'active' : ''}`} onSubmit={onSubmit}>
            <label>
                <span className="info-title">Next watering</span>
                <div className="info-value">
                    <button
                        className="add-button"
                        type="button"
                        onClick={() => setNextWateringDate(addDays(nextWateringDate, 1))}
                    >
                        +1
                    </button>
                    <input
                        name="next-water-date"
                        type="date"
                        value={format(nextWateringDate, 'yyyy-MM-dd')}
                        onChange={updateDate}
                    />
                </div>
            </label>
            <label>
                <span className="info-title">Location</span>
                <input
                    className="info-value location-input"
                    type="string"
                    name="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                ></input>
            </label>
            <label>
                <span className="info-title">Interval (days)</span>
                <input
                    className="info-value interval-input"
                    type="number"
                    name="interval"
                    value={interval}
                    onChange={e => setInterval(e.target.value)}
                />
            </label>
            <div>
                <span className="info-title">Average interval (days)</span>
                <span className="info-value"> {weightedAvg(intervals).toFixed(1)}</span>
            </div>
            <div>
                <span className="info-title">Prev. intervals</span>
                <span className="info-value">{intervals.slice(0, 8).join(', ')}</span>
            </div>
            <button className="confirm-button" type="submit">
                Confirm
            </button>
        </form>
    );
};

export default InfoTabPanel;
