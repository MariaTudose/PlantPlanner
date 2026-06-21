import { PixelCrop } from 'react-image-crop';

const OUTPUT_SIZE = 800;
const WEBP_QUALITY = 0.82;

export const fileToObjectUrl = (file: File): string => URL.createObjectURL(file);

export const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
    });

/** Crops to the given pixel region, scales to OUTPUT_SIZExOUTPUT_SIZE, returns webp data URI. */
export const cropAndCompress = (
    img: HTMLImageElement,
    crop: PixelCrop,
    displayWidth: number,
    displayHeight: number,
): string => {
    const scaleX = img.naturalWidth / displayWidth;
    const scaleY = img.naturalHeight / displayHeight;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
    );

    return canvas.toDataURL('image/webp', WEBP_QUALITY);
};
