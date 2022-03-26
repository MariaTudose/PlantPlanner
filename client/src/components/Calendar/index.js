import React, { useState, useEffect } from 'react';
import PlantGrid from '../PlantGrid';
import { months, weekDays, getFirstWeekDay, getDaysInMonth } from './utils';

import './style.scss';

const plantsToday = (plants, date) =>
    plants.filter(plant => new Date(plant.wateringDay).toDateString() === date.toDateString());

const CalendarDays = ({ daysInMonth, date, plants, plantsToday, selectDay }) => {
    return [...Array(daysInMonth)].map((x, day) => {
        const newDate = new Date(date.getFullYear(), date.getMonth(), day + 1);
        const intervals = plantsToday(plants, newDate)
            .map(plants => plants.interval)
            .reduce((res, interval) => {
                res[interval] = (res[interval] || 0) + 1;
                return res;
            }, {});

        return (
            <div key={day} className={date.getDate() === day + 1 ? 'today' : ''}>
                <button onClick={() => selectDay(day + 1, plantsToday)}>{day + 1}</button>
                {Object.keys(intervals).map(interval => (
                    <div key={interval}>
                        {intervals[interval]}x
                        <button key={interval} onClick={() => selectDay(day + 1, plantsToday)} className="interval">
                            {interval}
                        </button>
                    </div>
                ))}
            </div>
        );
    });
};

const Calendar = ({ plants, date, setDate, selectMonth, selectDay, firstWeekDay, daysInMonth }) => (
    <div className="calendar">
        <div className="calendar-header">
            <h1>
                {months[date.getMonth()]} {date.getFullYear()}
            </h1>
            <div className="date">
                <button onClick={() => selectMonth(-1)}>{'<'}</button>
                <button onClick={() => setDate(new Date())}>Today</button>
                <button onClick={() => selectMonth(1)}>{'>'}</button>
            </div>
        </div>
        <div className="month">
            {weekDays.map(week => (
                <div key={week}>{week}</div>
            ))}
            {[...Array(firstWeekDay)].map((x, i) => (
                <div key={i}></div>
            ))}
            <CalendarDays
                daysInMonth={daysInMonth}
                date={date}
                plants={plants}
                plantsToday={plantsToday}
                selectDay={selectDay}
            />
        </div>
    </div>
);

const CalendarView = ({ plants }) => {
    const [date, setDate] = useState(new Date());
    const [firstWeekDay, setFirstWeekDay] = useState(getFirstWeekDay(date));
    const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(date));
    const [visiblePlants, setVisiblePlants] = useState([]);

    useEffect(() => {
        setFirstWeekDay(getFirstWeekDay(date));
        setDaysInMonth(getDaysInMonth(date));
        setVisiblePlants(plantsToday(plants, date));
    }, [plants, date]);

    const selectMonth = diff => {
        setDate(new Date(date.getFullYear(), date.getMonth() + diff));
    };

    const selectDay = day => {
        setDate(new Date(date.getFullYear(), date.getMonth(), day));
    };

    return (
        <div id="calendar">
            <Calendar
                plants={plants}
                date={date}
                setDate={setDate}
                selectMonth={selectMonth}
                selectDay={selectDay}
                firstWeekDay={firstWeekDay}
                daysInMonth={daysInMonth}
            />
            <div className="aside">
                <div className="calendar-header">
                    <div className="date">
                        <button onClick={() => selectDay(date.getDate() - 1)}>{'<'}</button>
                        {weekDays[(date.getDay() + 6) % 7]} {date.getDate()}.{date.getMonth() + 1}
                        <button onClick={() => selectDay(date.getDate() + 1)}>{'>'}</button>
                    </div>
                </div>
                {visiblePlants.length ? <PlantGrid plants={visiblePlants} /> : <div>No plants to water today!</div>}
            </div>
        </div>
    );
};

export default CalendarView;
