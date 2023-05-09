import { NavLink } from 'react-router-dom';
import './style.scss';

const Navigation = () => (
    <nav id="navigation">
        <NavLink to="/plants">Plants</NavLink>
        <NavLink to="/">Schedule</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
    </nav>
);

export default Navigation;
