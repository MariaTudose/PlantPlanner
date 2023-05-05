import { FormEvent, useContext, useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';

import { useDelay } from '../../hooks/useDelay';
import { useScroll } from '../../hooks/useScroll';
import { updatePlant } from '../../services/plants';
import { createActions } from '../../services/actions';
import { ReactComponent as Drop } from '../../static/drop.svg';
import { ReactComponent as Done } from '../../static/done.svg';
import { PlantContextProps, PlantContext } from '../App';
import PlantPic from '../PlantGrid/PlantPic';
import { getPrevIntervals, weightedAvg } from './utils';

import './style.scss';

interface PlantModalProps {
    plantIndex: number;
    setPlantIndex: (plant: number) => void;
    modalPlants: Array<Plant>;
}

const PlantModal = ({ plantIndex, setPlantIndex, modalPlants }: PlantModalProps) => {
    const [plant, setPlant] = useState<Plant | null>(null);
    const { plants, setPlants } = useContext(PlantContext) as PlantContextProps;

    const [nextWateringDate, setNextWateringDate] = useState(new Date());
    const [interval, setInterval] = useState('0');
    const [location, setLocation] = useState('');
    const [intervals, setIntervals] = useState<Array<number>>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [waterOnDate, setWaterOnDate] = useState(new Date());

    const closeModal = () => setPlant(null);

    useScroll(modalPlants, plantIndex, closeModal, setPlantIndex);
    useDelay(!!plant, setPlantIndex);

    useEffect(() => {
        setPlant(modalPlants[plantIndex - 1]);
    }, [modalPlants, plantIndex]);

    useEffect(() => {
        if (plant) {
            getPrevIntervals(plant.id).then(intervals => setIntervals(intervals));
            setNextWateringDate(plant.nextWateringDate);
            setInterval(plant.interval);
            setLocation(plant.location);
        }
    }, [plant]);

    const updatePlants = (updatedPlant: Plant) => {
        setPlants(plants.map(plant => (plant.id === updatedPlant.id ? updatedPlant : plant)));
    };

    const updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if (!newDate.getTime()) return null;
        if (e.target.name === 'next-water-date') {
            setNextWateringDate(newDate);
        } else {
            setWaterOnDate(newDate);
        }
    };

    const onWater = (e: FormEvent) => {
        e.preventDefault();
        if (plant) {
            const plantBody = { nextWateringDate: addDays(waterOnDate, Number(interval)) };
            const actionBody = { plantId: plant.id, action: 'water', date: new Date() };
            updatePlant(plant.id, plantBody).then(updatedPlant => {
                updatePlants(updatedPlant);
                setNextWateringDate(plantBody.nextWateringDate);
                setDropdownOpen(false);
                createActions([actionBody]);
            });
        }
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (plant) {
            const body = { nextWateringDate, interval, location };
            updatePlant(plant.id, body).then(updatedPlant => updatePlants(updatedPlant));
            closeModal();
        }
    };

    return (
        <div id="plant-modal" className={`${plant ? 'visible' : ''}`}>
            <button type="button" className="modal-backdrop" aria-label="Close modal" onClick={closeModal} />
            <form className="modal-content" onSubmit={onSubmit}>
                <div className="plant-pic-container">
                    <PlantPic plant={plant} />
                    <div className="plant-pic-overlay">
                        <div>
                            <h1>{plant?.name}</h1>
                            <i>{plant?.userEnteredPlantType}</i>
                        </div>
                        <div className="water-dropdown">
                            <button
                                className="icon-button"
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <Drop />
                            </button>
                            <div className={`water-dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                                <input
                                    name="water-date"
                                    type="date"
                                    value={format(waterOnDate, 'yyyy-MM-dd')}
                                    onChange={updateDate}
                                />
                                <button className="menu-confirm-button" onClick={onWater}>
                                    <Done />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="plant-info">
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
                </div>
                <div className="plant-actions">
                    <button className="confirm-button" type="submit">
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlantModal;
