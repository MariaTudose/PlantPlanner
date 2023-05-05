import { useCallback, useEffect } from 'react';

export const useScroll = (
    sortedPlants: Array<Plant>,
    plantIndex: number,
    closeModal: () => void,
    setSelectedPlant: (plant: number) => void
) => {
    const scrollPlant = useCallback(
        (i: number) => {
            if (plantIndex) {
                const n = sortedPlants.length;
                const iNext = plantIndex + i - 1;
                const iMod = ((iNext % n) + n) % n;
                setSelectedPlant(iMod + 1);
            }
        },
        [plantIndex, sortedPlants, setSelectedPlant]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const { key } = event;
            if (plantIndex) {
                if (key === 'ArrowLeft') scrollPlant(-1);
                else if (key === 'ArrowRight') scrollPlant(1);
                else if (key === 'Escape') closeModal();
            }
        },
        [closeModal, scrollPlant, plantIndex]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
};
