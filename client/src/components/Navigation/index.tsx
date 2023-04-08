import { NavLink } from 'react-router-dom';
import './style.scss';

const Navigation = () => (
    <nav id="navigation">
        <NavLink to="/">Plants</NavLink>
        <NavLink to="/schedule">Schedule</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
    </nav>
);

export default Navigation;
