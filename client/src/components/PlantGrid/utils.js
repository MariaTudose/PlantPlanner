import placeholder from './placeholder.webp';

export const getPhotoSrc = plant =>
    plant?.pictures.length ? `${process.env.REACT_APP_API_URL}${plant.pictures[0]}.webp` : placeholder;

export const setPlaceholder = e => {
    e.onError = null;
    e.target.src = placeholder;
};
