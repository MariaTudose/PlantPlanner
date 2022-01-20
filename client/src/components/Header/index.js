import { NavLink } from 'react-router-dom';
import './style.scss';

const Header = () => (
    <div id="header">
        <NavLink to="/">Plants</NavLink>
        <NavLink to="/schedule">Schedule</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
    </div>
);

export default Header;
