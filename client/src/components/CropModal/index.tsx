import { useCallback, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, PixelCrop, type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { cropAndCompress } from '../../utils/imageUtils';

import './style.scss';

interface CropModalProps {
    imageSrc: string;
    onConfirm: (base64: string) => void;
    onCancel: () => void;
}

const CropModal = ({ imageSrc, onConfirm, onCancel }: CropModalProps) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const initial = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height);
        setCrop(initial);
    }, []);

    const handleConfirm = () => {
        if (!imgRef.current || !completedCrop) return;
        const { offsetWidth, offsetHeight } = imgRef.current;
        const base64 = cropAndCompress(imgRef.current, completedCrop, offsetWidth, offsetHeight);
        onConfirm(base64);
    };

    return (
        <div className="crop-modal-overlay">
            <div className="crop-modal-content">
                <p className="crop-instructions">Drag or resize to select the square area</p>
                <div className="crop-area">
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={1}
                        circularCrop={false}
                    >
                        <img ref={imgRef} src={imageSrc} alt="Crop preview" onLoad={onImageLoad} />
                    </ReactCrop>
                </div>
                <div className="crop-actions">
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="confirm-button" onClick={handleConfirm} disabled={!completedCrop}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
