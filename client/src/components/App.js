import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PlantGrid from './PlantGrid';
import Schedule from './Schedule';
import Calendar from './Calendar';
import Header from './Header';
import { allPlants } from '../utils';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path="/" element={<PlantGrid plants={allPlants} />}></Route>
                <Route exact path="/schedule" element={<Schedule plants={allPlants} />}></Route>
                <Route exact path="/calendar" element={<Calendar plants={allPlants} />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
