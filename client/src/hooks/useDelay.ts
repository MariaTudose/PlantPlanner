import { useRef, useEffect } from 'react';

export const useDelay = (
    modalOpen: boolean,
    setPlant: (plant: Plant | null) => void,
    setPlantIndex: (plantIndex: number) => void
) => {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!modalOpen) {
            timeout.current = setTimeout(() => {
                setPlant(null);
                setPlantIndex(0);
            }, 300);
        } else if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }, [modalOpen, setPlant, setPlantIndex]);
};
