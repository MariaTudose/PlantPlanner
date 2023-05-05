import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PlantGrid from './PlantGrid';
import Schedule from './Schedule';
import Calendar from './Calendar';
import Navigation from './Navigation';
import { getAllPlants } from '../services/plants';
import PlantModal from './PlantModal';

export interface PlantContextProps {
    plants: Array<Plant>;
    setPlants: (plants: Array<Plant>) => void;
    selectedPlant: Plant | null;
    setSelectedPlant: (plant: Plant | null) => void;
    togglePlantModal: () => void;
}

export const PlantContext = createContext<PlantContextProps | null>(null);

const App = () => {
    const [plants, setPlants] = useState<Array<Plant>>([]);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [modalVisibility, setModalVisibility] = useState(false);

    useEffect(() => {
        getAllPlants().then(res => {
            if (res) setPlants(res);
        });
    }, []);

    const closeModal = () => {
        setModalVisibility(false);
        setTimeout(() => {
            setSelectedPlant(null);
        }, 300);
    };

    const togglePlantModal = () => {
        if (modalVisibility) closeModal();
        else setModalVisibility(true);
    };

    return (
        <BrowserRouter>
            <Navigation />
            <PlantContext.Provider
                value={{
                    plants,
                    setPlants,
                    selectedPlant,
                    setSelectedPlant,
                    togglePlantModal,
                }}
            >
                <Routes>
                    <Route path="/" element={<PlantGrid plants={plants} />}></Route>
                    <Route path="/schedule" element={<Schedule />}></Route>
                    <Route path="/calendar" element={<Calendar />}></Route>
                </Routes>
                <PlantModal plant={selectedPlant} visibility={modalVisibility} closeModal={closeModal} />
            </PlantContext.Provider>
        </BrowserRouter>
    );
};

export default App;
