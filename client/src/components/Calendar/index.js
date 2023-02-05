import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, addMonths, subMonths, setDate, isEqual, isSameMonth } from 'date-fns';
import { weekDays, getFirstWeekday, getLastWeekday, getDaysInMonth, getPlantsToday, getIntervals } from './utils';
import PlantGrid from '../PlantGrid';

import './style.scss';

const CalendarDay = ({ date, selectedDate, setSelectedDate, plants }) => {
    const plantsToday = getPlantsToday(plants, date);
    return (
        <button
            className={`day ${isEqual(selectedDate, date) ? 'selected' : ''}`}
            onClick={() => setSelectedDate(date)}
        >
            <span className={`date ${!isSameMonth(selectedDate, date) ? 'other-month' : ''}`}>{format(date, 'd')}</span>
            <div className="interval-container">
                {Object.entries(getIntervals(plantsToday)).map(([interval, amount]) => (
                    <div key={interval}>
                        {amount}x<span className="interval">{interval}</span>
                    </div>
                ))}
            </div>
            {plantsToday.length > 0 && <div className="plant-amount">{plantsToday.length}</div>}
        </button>
    );
};

const Calendar = ({ plants, selectedDate, setSelectedDate }) => {
    const prevMonthDays = getFirstWeekday(selectedDate);
    const nextMonthDays = 6 - getLastWeekday(selectedDate);
    const visibleDays = getDaysInMonth(selectedDate) + prevMonthDays + nextMonthDays;

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h1>{format(selectedDate, 'MMM yyyy')}</h1>
                <div className="date">
                    <button onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>{'<'}</button>
                    <button onClick={() => setSelectedDate(new Date())}>Today</button>
                    <button onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>{'>'}</button>
                </div>
            </div>
            <div className="month">
                {weekDays.map(weekDay => (
                    <div className="day" key={weekDay}>
                        {weekDay}
                    </div>
                ))}
                {[...Array(visibleDays).keys()].map(i => (
                    <CalendarDay
                        key={i}
                        date={setDate(selectedDate, -prevMonthDays + i + 1)}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        plants={plants}
                    />
                ))}
            </div>
        </div>
    );
};

const CalendarAside = ({ plants, setSelectedDate, selectedDate }) => (
    <div className="aside">
        <header className="calendar-header">
            <div className="date">
                <button onClick={() => setSelectedDate(subDays(selectedDate, 1))}>{'<'}</button>
                {format(selectedDate, 'E d.M')}
                <button onClick={() => setSelectedDate(addDays(selectedDate, 1))}>{'>'}</button>
            </div>
        </header>
        {plants.length ? <PlantGrid plants={plants} /> : <div>No plants to water today!</div>}
    </div>
);

const CalendarView = ({ plants }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visiblePlants, setVisiblePlants] = useState([]);

    useEffect(() => {
        setVisiblePlants(getPlantsToday(plants, selectedDate));
    }, [plants, selectedDate]);

    return (
        <div id="calendar">
            <Calendar plants={plants} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <CalendarAside plants={visiblePlants} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
    );
};

export default CalendarView;
