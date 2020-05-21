import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootNav, Nav } from 'react-bootstrap';
import './style.css';


const Navbar = props => {

  return (
    <BootNav bg="light" expand="lg">

      <Link to="/" className="navbar-brand">
        <i className="fas fa-home"></i> Home
      </Link>

      <BootNav.Toggle aria-controls="basic-navbar-nav" />
      <BootNav.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">

          <Link to="/profile" className="nav-link">
            <i className="fas fa-user-lock"></i> Profile
          </Link>

          <Link to="/register" className="nav-link">
            <i className="fas fa-user-plus"></i> Register
          </Link>

          <Link to="/login" className="nav-link">
            <i className="fas fa-sign-in-alt"></i> Sign In
          </Link>

          <Link to="/" className="nav-link">
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </Link>

        </Nav>
      </BootNav.Collapse>

    </BootNav>
  );
}

export default Navbar;