import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, addMonths, subMonths, setDate, isEqual, isSameMonth } from 'date-fns';
import { weekDays, getFirstWeekday, getLastWeekday, getDaysInMonth, plantsToday, getIntervals } from './utils';
import PlantGrid from '../PlantGrid';

import './style.scss';

const CalendarDay = ({ date, selectedDate, setSelectedDate, plants }) => (
    <div className={isEqual(selectedDate, date) ? 'selected' : ''}>
        <button className={!isSameMonth(selectedDate, date) ? 'other-month' : ''} onClick={() => setSelectedDate(date)}>
            {format(date, 'd')}
        </button>
        {Object.entries(getIntervals(plants, date)).map(([interval, amount]) => (
            <div key={interval}>
                {amount}x
                <button onClick={() => setSelectedDate(date)} className="interval">
                    {interval}
                </button>
            </div>
        ))}
    </div>
);

const CalendarDays = ({ selectedDate, setSelectedDate, plants }) => {
    const prevMonthDays = getFirstWeekday(selectedDate);
    const nextMonthDays = 6 - getLastWeekday(selectedDate);
    const visibleDays = getDaysInMonth(selectedDate) + prevMonthDays + nextMonthDays;

    return [...Array(visibleDays).keys()].map(i => (
        <CalendarDay
            key={i}
            date={setDate(selectedDate, -prevMonthDays + i + 1)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            plants={plants}
        />
    ));
};

const Calendar = ({ plants, selectedDate, setSelectedDate }) => (
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
            {weekDays.map(week => (
                <div key={week}>{week}</div>
            ))}
            <CalendarDays selectedDate={selectedDate} setSelectedDate={setSelectedDate} plants={plants} />
        </div>
    </div>
);

const CalendarAside = ({ plants, setSelectedDate, selectedDate }) => (
    <div className="aside">
        <div className="calendar-header">
            <div className="date">
                <button onClick={() => setSelectedDate(subDays(selectedDate, 1))}>{'<'}</button>
                {format(selectedDate, 'E d.M')}
                <button onClick={() => setSelectedDate(addDays(selectedDate, 1))}>{'>'}</button>
            </div>
        </div>
        {plants.length ? <PlantGrid plants={plants} /> : <div>No plants to water today!</div>}
    </div>
);

const CalendarView = ({ plants }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visiblePlants, setVisiblePlants] = useState([]);

    useEffect(() => {
        setVisiblePlants(plantsToday(plants, selectedDate));
    }, [plants, selectedDate]);

    return (
        <div id="calendar">
            <Calendar plants={plants} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <CalendarAside plants={visiblePlants} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
    );
};

export default CalendarView;
