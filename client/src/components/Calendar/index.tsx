import { useState, useEffect, useContext } from 'react';
import { format, addMonths, subMonths, setDate, isEqual, isSameMonth } from 'date-fns';

import ChevronLeft from '../../static/chevron_left.svg?react';
import ChevronRight from '../../static/chevron_right.svg?react';

import { weekDays, getFirstWeekday, getLastWeekday, getDaysInMonth, getPlantsToday, getIntervals } from './utils';
import PlantGrid from '../PlantGrid';
import { PlantContext, PlantContextProps } from '../App';

import './style.scss';

interface CalendarDayProps {
    plants: Plant[];
    date: Date;
    selectedDate: Date;
    setSelectedDate: (value: Date) => void;
}

const CalendarDay = ({ date, selectedDate, setSelectedDate, plants }: CalendarDayProps) => {
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

interface CalendarProps {
    plants: Plant[];
    selectedDate: Date;
    setSelectedDate: (value: Date) => void;
}

const Calendar = ({ plants, selectedDate, setSelectedDate }: CalendarProps) => {
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
                {Array.from(Array(visibleDays).keys()).map(i => (
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

interface CalendarAsideProps {
    plants: Plant[];
    selectedDate: Date;
}

const CalendarAside = ({ plants, selectedDate }: CalendarAsideProps) => (
    <aside className="aside">
        <header className="calendar-header">
            <h3>{format(selectedDate, 'E d.M')}</h3>
        </header>
        {plants.length ? <PlantGrid plants={plants} /> : <span>No plants to water today!</span>}
    </aside>
);

const CalendarView = () => {
    const { plants } = useContext(PlantContext) as PlantContextProps;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visiblePlants, setVisiblePlants] = useState<Plant[]>([]);

    useEffect(() => {
        setVisiblePlants(getPlantsToday(plants, selectedDate));
    }, [plants, selectedDate]);

    return (
        <main id="calendar">
            <Calendar plants={plants} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <CalendarAside plants={visiblePlants} selectedDate={selectedDate} />
        </main>
    );
};

export default CalendarView;
