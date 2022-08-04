import placeholder from './placeholder.jpg';

export const getPhotoSrc = plant =>
    plant?.pictures.length ? `${process.env.REACT_APP_API_URL}images/${plant.pictures[0]}.jpg` : placeholder;

export const setPlaceholder = e => {
    e.onError = null;
    e.target.src = placeholder;
};
