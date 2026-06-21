import { FormEvent, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { createPlant } from '../../services/plants';
import { getPlantLocations } from '../../services/plants';

import Close from '../../static/close.svg?react';

import { PlantContext, PlantContextProps } from '../App';

import './style.scss';

interface AddPlantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddPlantModal = ({ isOpen, onClose }: AddPlantModalProps) => {
    const { plants, setPlants } = useContext(PlantContext) as PlantContextProps;

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [interval, setInterval] = useState('7');
    const [lastWateringDate, setLastWateringDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [species, setSpecies] = useState('');
    const [userEnteredPlantType, setUserEnteredPlantType] = useState('');
    const [acquisitionDate, setAcquisitionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [needsFertilizer, setNeedsFertilizer] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);

    useEffect(() => {
        getPlantLocations().then(res => {
            if (res) setLocations(res);
        });
    }, []);

    const resetForm = () => {
        setName('');
        setLocation('');
        setInterval('7');
        setLastWateringDate(format(new Date(), 'yyyy-MM-dd'));
        setSpecies('');
        setUserEnteredPlantType('');
        setAcquisitionDate(format(new Date(), 'yyyy-MM-dd'));
        setNeedsFertilizer(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        createPlant({
            name,
            location,
            interval,
            lastWateringDate: new Date(lastWateringDate),
            species,
            userEnteredPlantType,
            acquisitionDate,
            needsFertilizer,
        } as any).then(newPlant => {
            setPlants([...plants, newPlant]);
            handleClose();
        });
    };

    return (
        <div id="add-plant-modal" className={isOpen ? 'visible' : ''}>
            <button type="button" className="modal-backdrop" aria-label="Close modal" onClick={handleClose} />
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Plant</h2>
                    <button className="close-button" type="button" onClick={handleClose} aria-label="Close">
                        <Close />
                    </button>
                </div>
                <form className="add-plant-form" onSubmit={onSubmit}>
                    <label>
                        <span className="info-title">Name</span>
                        <input
                            className="info-value"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <span className="info-title">Location</span>
                        <input
                            className="info-value location-input"
                            type="search"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            list="add-plant-locations"
                            required
                        />
                        <datalist id="add-plant-locations">
                            {locations.map(loc => (
                                <option key={loc}>{loc}</option>
                            ))}
                        </datalist>
                    </label>
                    <label>
                        <span className="info-title">Interval (days)</span>
                        <input
                            className="info-value interval-input"
                            type="number"
                            min="1"
                            value={interval}
                            onChange={e => setInterval(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <span className="info-title">Last watered</span>
                        <input
                            className="info-value"
                            type="date"
                            value={lastWateringDate}
                            onChange={e => setLastWateringDate(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <span className="info-title">Species</span>
                        <input
                            className="info-value"
                            type="text"
                            value={species}
                            onChange={e => setSpecies(e.target.value)}
                        />
                    </label>
                    <label>
                        <span className="info-title">Plant type</span>
                        <input
                            className="info-value"
                            type="text"
                            value={userEnteredPlantType}
                            onChange={e => setUserEnteredPlantType(e.target.value)}
                        />
                    </label>
                    <label>
                        <span className="info-title">Acquired</span>
                        <input
                            className="info-value"
                            type="date"
                            value={acquisitionDate}
                            onChange={e => setAcquisitionDate(e.target.value)}
                        />
                    </label>
                    <label className="checkbox-container">
                        <span className="info-title">Needs fertilizer</span>
                        <input
                            className="info-value checkbox"
                            type="checkbox"
                            checked={needsFertilizer}
                            onChange={e => setNeedsFertilizer(e.target.checked)}
                        />
                        <span className="custom-checkbox" />
                    </label>
                    <button className="confirm-button" type="submit">
                        Add Plant
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPlantModal;
