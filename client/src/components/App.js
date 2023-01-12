import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PlantGrid from './PlantGrid';
import Schedule from './Schedule';
import Calendar from './Calendar';
import Header from './Header';
import { getAllPlants } from '../services/plants';

export const PlantContext = createContext();

const App = () => {
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        getAllPlants().then(res => {
            if (res) setPlants(res);
        });
    }, []);

    return (
        <BrowserRouter>
            <Header />
            <PlantContext.Provider value={{ plants, setPlants }}>
                <Routes>
                    <Route exact path="/" element={<PlantGrid plants={plants} />}></Route>
                    <Route exact path="/schedule" element={<Schedule />}></Route>
                    <Route exact path="/calendar" element={<Calendar plants={plants} />}></Route>
                </Routes>
            </PlantContext.Provider>
        </BrowserRouter>
    );
};

export default App;
