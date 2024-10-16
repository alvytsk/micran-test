import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__logo">Monitoring Dashboard</div>
      <nav className="header__nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "header__nav-link header__nav-link--active" : "header__nav-link"}>
          Главная
        </NavLink>
        <NavLink to="/objects" className={({ isActive }) => isActive ? "header__nav-link header__nav-link--active" : "header__nav-link"}>
          Объекты
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;