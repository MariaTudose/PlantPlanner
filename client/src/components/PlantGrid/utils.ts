import placeholder from './placeholder.webp';

const isDataUri = (s: string) => s.startsWith('data:');

export const getPhotoSrc = (pictures: string[]) => {
    if (!pictures.length) return placeholder;
    const first = pictures[0];
    return isDataUri(first) ? first : `${import.meta.env.VITE_APP_API_URL}${first}.webp`;
};
