import placeholder from './placeholder.webp';

export const getPhotoSrc = (pictures: string[]) =>
    pictures.length ? `${import.meta.env.VITE_APP_API_URL}${pictures[0]}.webp` : placeholder;
