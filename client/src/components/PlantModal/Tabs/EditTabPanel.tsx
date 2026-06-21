import { ChangeEvent, useState, useEffect, FormEvent } from 'react';
import { updatePlant, deletePlant } from '../../../services/plants';
import { Plant } from '../../../types';
import { fileToObjectUrl } from '../../../utils/imageUtils';
import CropModal from '../../CropModal';

import './style.scss';

interface EditTabPanelProps {
    active: boolean;
    plant: Plant | null;
    closeModal: () => void;
    updatePlants: (plant: Plant) => void;
    onDeletePlant: () => void;
}

const EditTabPanel = ({ active, plant, closeModal, updatePlants, onDeletePlant }: EditTabPanelProps) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [userEnteredPlantType, setUserEnteredPlantType] = useState('');
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [pictureBase64, setPictureBase64] = useState<string | null>(null);
    const [picturePreview, setPicturePreview] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (plant) {
            setName(plant.name);
            setSpecies(plant.species || '');
            setUserEnteredPlantType(plant.userEnteredPlantType || '');
            setPictureBase64(null);
            setPicturePreview(null);
            setConfirmDelete(false);
        }
    }, [plant]);

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

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const body: Partial<Plant> = { name, species, userEnteredPlantType };
        if (pictureBase64) body.pictures = [pictureBase64];
        updatePlant(plant!.id, body).then(updatedPlant => updatePlants(updatedPlant));
        closeModal();
    };

    const onDelete = () => {
        deletePlant(plant!.id).then(() => onDeletePlant());
    };

    return (
        <>
            {cropSrc && <CropModal imageSrc={cropSrc} onConfirm={onCropConfirm} onCancel={onCropCancel} />}
            <form className={`plant-info ${active ? 'active' : ''}`} onSubmit={onSubmit}>
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
                <label className="picture-label">
                    <span className="info-title">Picture</span>
                    <span className="info-value picture-input-wrapper">
                        <input type="file" accept="image/*" onChange={onPictureChange} />
                    </span>
                    {picturePreview && (
                        <img className="picture-preview" src={picturePreview} alt="New picture preview" />
                    )}
                </label>
                <div className="form-actions">
                    {confirmDelete ? (
                        <div className="delete-confirm">
                            <span>Delete this plant?</span>
                            <button
                                type="button"
                                className="cancel-delete-button"
                                onClick={() => setConfirmDelete(false)}
                            >
                                Cancel
                            </button>
                            <button type="button" className="confirm-delete-button" onClick={onDelete}>
                                Delete
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="delete-button" onClick={() => setConfirmDelete(true)}>
                            Delete plant
                        </button>
                    )}
                    <button className="confirm-button" type="submit">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
};

export default EditTabPanel;
