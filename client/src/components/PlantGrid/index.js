import React from 'react';
import './style.scss';
import plantData from '../../vera-export/data.json';

const schedules = plantData
    .find(obj => obj.collectionName === 'schedules')
    .docs.map(schedule => ({ id: schedule.id, interval: schedule.daysInterval }));

const allPlants = plantData
    .find(obj => obj.collectionName === 'plants')
    .docs.filter(plant => !plant.isDeleted)
    .map(plant => ({ ...plant, interval: schedules.find(schedule => schedule.id === plant.scheduleId).interval }));

const PlantGrid = ({ plants = allPlants }) => {
    return (
        <div id="plant-grid">
            {plants.map(plant => (
                <button key={plant.id} className="plant-card">
                    <span>{plant.interval}</span>
                    <img
                        className="plant-pic"
                        src={
                            plant.pictures.length
                                ? require(`../../vera-export/images/${plant.pictures[0]}.jpg`)
                                : require('../../vera-export/images/placeholder.png')
                        }
                        alt={plant.name}
                    ></img>
                    <span>{plant.name}</span>
                </button>
            ))}
        </div>
    );
};

export default PlantGrid;
