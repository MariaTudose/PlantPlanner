import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PlantGrid from './PlantGrid';
import Schedule from './Schedule';
import Calendar from './Calendar';
import Navigation from './Navigation';
import { getAllPlants } from '../services/plants';

export interface PlantContextProps {
    plants: Array<Plant>;
    setPlants: (plants: Array<Plant>) => void;
}

export const PlantContext = createContext<PlantContextProps | null>(null);

const App = () => {
    const [plants, setPlants] = useState<Array<Plant>>([]);

    useEffect(() => {
        getAllPlants().then(res => {
            if (res) setPlants(res);
        });
    }, []);

    return (
        <BrowserRouter>
            <Navigation />
            <PlantContext.Provider value={{ plants, setPlants }}>
                <Routes>
                    <Route path="/" element={<PlantGrid plants={plants} />}></Route>
                    <Route path="/schedule" element={<Schedule />}></Route>
                    <Route path="/calendar" element={<Calendar />}></Route>
                </Routes>
            </PlantContext.Provider>
        </BrowserRouter>
    );
};

export default App;
