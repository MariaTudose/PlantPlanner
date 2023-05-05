import { useState, useEffect, createContext, useRef } from 'react';
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
    openModal: (modalPlants: Array<Plant>, plant: number) => void;
}

export const PlantContext = createContext<PlantContextProps | null>(null);

const App = () => {
    const [plants, setPlants] = useState<Array<Plant>>([]);
    const [plantIndex, setPlantIndex] = useState<number>(0);
    const [modalPlants, setModalPlants] = useState<Array<Plant>>([]);

    useEffect(() => {
        getAllPlants().then(res => {
            if (res) setPlants(res);
        });
    }, []);

    const openModal = (modalPlants: Array<Plant>, plantIndex: number) => {
        setPlantIndex(plantIndex);
        setModalPlants(modalPlants);
    };

    return (
        <BrowserRouter>
            <Navigation />
            <PlantContext.Provider value={{ plants, setPlants, openModal }}>
                <Routes>
                    <Route path="/" element={<PlantGrid plants={plants} />}></Route>
                    <Route path="/schedule" element={<Schedule />}></Route>
                    <Route path="/calendar" element={<Calendar />}></Route>
                </Routes>
                <PlantModal plantIndex={plantIndex} setPlantIndex={setPlantIndex} modalPlants={modalPlants} />
            </PlantContext.Provider>
        </BrowserRouter>
    );
};

export default App;
