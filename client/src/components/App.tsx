import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { getAllPlants } from '../services/plants';
import { Plant } from '../types';

import PlantGrid from './PlantGrid';
import Schedule from './Schedule';
import Calendar from './Calendar';
import Navigation from './Navigation';
import PlantModal from './PlantModal';

export interface PlantContextProps {
    plants: Plant[];
    setPlants: (plants: Plant[]) => void;
    openModal: (modalPlants: Plant[], plant: number) => void;
}

export const PlantContext = createContext<PlantContextProps | null>(null);

const App = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [plantIndex, setPlantIndex] = useState<number>(0);
    const [modalPlants, setModalPlants] = useState<Plant[]>([]);

    useEffect(() => {
        getAllPlants().then(res => {
            if (res) setPlants(res);
        });
    }, []);

    const openModal = (modalPlants: Plant[], plantIndex: number) => {
        setPlantIndex(plantIndex);
        setModalPlants(modalPlants);
        document.body.classList.add('has-modal');
    };

    return (
        <BrowserRouter>
            <Navigation />
            <PlantContext.Provider value={{ plants, setPlants, openModal }}>
                <Routes>
                    <Route path="/plants" element={<PlantGrid plants={plants} />}></Route>
                    <Route path="/" element={<Schedule />}></Route>
                    <Route path="/calendar" element={<Calendar />}></Route>
                </Routes>
                <PlantModal plantIndex={plantIndex} setPlantIndex={setPlantIndex} modalPlants={modalPlants} />
            </PlantContext.Provider>
        </BrowserRouter>
    );
};

export default App;
