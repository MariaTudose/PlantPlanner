import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, setDate, isEqual, isSameMonth } from 'date-fns';

import { ReactComponent as ChevronLeft } from '../../static/chevron_left.svg';
import { ReactComponent as ChevronRight } from '../../static/chevron_right.svg';

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
            <header className="calendar-header">
                <h2>{format(selectedDate, 'MMM yyyy')}</h2>
                <button onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
                    <ChevronLeft />
                </button>
                <button onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
                    <ChevronRight />
                </button>
                <button className="today" onClick={() => setSelectedDate(new Date())}>
                    Today
                </button>
            </header>
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
    <aside className="aside">
        <header className="calendar-header">
            <h3>{format(selectedDate, 'E d.M')}</h3>
        </header>
        {plants.length ? <PlantGrid plants={plants} /> : <span>No plants to water today!</span>}
    </aside>
);

const CalendarView = ({ plants }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visiblePlants, setVisiblePlants] = useState([]);

    useEffect(() => {
        setVisiblePlants(getPlantsToday(plants, selectedDate));
    }, [plants, selectedDate]);

    return (
        <main id="calendar">
            <Calendar plants={plants} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <CalendarAside plants={visiblePlants} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </main>
    );
};

export default CalendarView;
