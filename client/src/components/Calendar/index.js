import React, { useState, useEffect } from 'react';
import PlantGrid from '../PlantGrid';
import { months, weekDays, getFirstWeekDay, getDaysInMonth } from './utils'

import './style.scss';

const Calendar = ({ plants }) => {
    const today = new Date();

    const [date, setDate] = useState(new Date());
    const [firstWeekDay, setFirstWeekDay] = useState(getFirstWeekDay(date));
    const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(date));
    const [visiblePlants, setVisiblePlants] = useState([]);

    const plantsToday = (plants, date) =>
        plants.filter(plant => plant.wateringDay.getDate() === date.getDate() && plant.wateringDay.getMonth() === date.getMonth());


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
            <div className="calendar">
                <div className="calendar-header">
                    <button onClick={() => setDate(today)}>Today</button>
                    <div className="date">
                        <button onClick={() => selectMonth(-1)}>{'<'}</button>
                        {months[date.getMonth()]} {date.getFullYear()}
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
                    {[...Array(daysInMonth)].map((x, day) => {
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
                    })}
                </div>
            </div>
            <div className="aside">
                <div className="calendar-header">
                    <div className="date">
                        <button onClick={() => selectDay(date.getDate() - 1)}>{'<'}</button>
                        {weekDays[(date.getDay() + 6) % 7]} {date.getDate()}.{date.getMonth() + 1}
                        <button onClick={() => selectDay(date.getDate() + 1)}>{'>'}</button>
                    </div>
                </div>
                <PlantGrid plants={visiblePlants} />
            </div>
        </div>
    );
};

export default Calendar;
