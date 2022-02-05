import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './base.scss';
import PlantGrid from './components/PlantGrid';
import Schedule from './components/Schedule';
import Calendar from './components/Calendar';
import Header from './components/Header';
import { allPlants } from './utils';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path="/" element={<PlantGrid plants={allPlants} />}></Route>
                <Route exact path="/schedule" element={<Schedule plants={allPlants} />}></Route>
                <Route exact path="/calendar" element={<Calendar plants={allPlants} />}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
