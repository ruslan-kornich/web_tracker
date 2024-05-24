import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Analytics Tracker</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/offers">Offers</Link>
        </li>
        <li>
          <Link to="/admin">Admin Panel</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
