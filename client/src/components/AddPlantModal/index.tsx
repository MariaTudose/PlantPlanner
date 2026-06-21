import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { createPlant, getPlantLocations } from '../../services/plants';
import { fileToObjectUrl } from '../../utils/imageUtils';

import Close from '../../static/close.svg?react';
import CropModal from '../CropModal';

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
    const [picturePreview, setPicturePreview] = useState<string | null>(null);
    const [pictureBase64, setPictureBase64] = useState<string | null>(null);
    const [cropSrc, setCropSrc] = useState<string | null>(null);
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
        setPicturePreview(null);
        setPictureBase64(null);
        setCropSrc(null);
    };

    const onPictureChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCropSrc(fileToObjectUrl(file));
    };

    const onCropConfirm = (base64: string) => {
        URL.revokeObjectURL(cropSrc!);
        setCropSrc(null);
        setPictureBase64(base64);
        setPicturePreview(base64);
    };

    const onCropCancel = () => {
        URL.revokeObjectURL(cropSrc!);
        setCropSrc(null);
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
            pictures: pictureBase64 ? [pictureBase64] : [],
        } as any).then(newPlant => {
            setPlants([...plants, newPlant]);
            handleClose();
        });
    };

    return (
        <>
            {cropSrc && <CropModal imageSrc={cropSrc} onConfirm={onCropConfirm} onCancel={onCropCancel} />}
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
                        <label className="picture-label">
                            <span className="info-title">Picture</span>
                            <span className="info-value picture-input-wrapper">
                                <input type="file" accept="image/*" onChange={onPictureChange} />
                            </span>
                            {picturePreview && <img className="picture-preview" src={picturePreview} alt="Preview" />}
                        </label>
                        <button className="confirm-button" type="submit">
                            Add Plant
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddPlantModal;
