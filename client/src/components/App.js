import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PlantGrid from './PlantGrid';
import Schedule from './Schedule';
import Calendar from './Calendar';
import Header from './Header';
import { getAllPlants } from '../services/plants';

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
            <Routes>
                <Route exact path="/" element={<PlantGrid plants={plants} />}></Route>
                <Route exact path="/schedule" element={<Schedule plants={plants} />}></Route>
                <Route exact path="/calendar" element={<Calendar plants={plants} />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
