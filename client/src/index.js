import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './base.scss';
import PlantGrid from './components/PlantGrid';
import Header from './components/Header';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path="/" element={<PlantGrid />}></Route>
                <Route exact path="/schedule" element={<PlantGrid />}></Route>
                <Route exact path="/calendar" element={<PlantGrid />}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
