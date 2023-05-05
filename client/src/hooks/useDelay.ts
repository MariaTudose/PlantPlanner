import { useRef, useEffect } from 'react';

export const useDelay = (plant: boolean, setPlantIndex: (plantIndex: number) => void) => {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!plant) {
            timeout.current = setTimeout(() => setPlantIndex(0), 300);
        } else if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }, [plant, setPlantIndex]);
};
