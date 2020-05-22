import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootNav, Nav } from 'react-bootstrap';
import './style.css';


const Navbar = props => {
  const [loc, setLoc] = useState(window.location.pathname);

  const handleLogout = () => {
    document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  return (
    <BootNav bg="light" expand="lg">

      <Link to="/" className="navbar-brand" onClick={() => setLoc('/')}>
        <i className="fas fa-home"></i> Home
      </Link>

      <BootNav.Toggle aria-controls="basic-navbar-nav" />
      <BootNav.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">

          <Link
            to="/profile"
            className={
              loc === '/profile'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() => setLoc('/profile')}
          >
            <i className="fas fa-user-lock"></i> Profile
          </Link>

          <Link
            to="/register"
            className={
              loc === '/register'
                ? 'nav-link active'
                : 'nav-link'}
            onClick={() => setLoc('/register')}
          >
            <i className="fas fa-user-plus"></i> Register
          </Link>

          <Link
            to="/login"
            className={loc === '/login'
              ? 'nav-link active'
              : 'nav-link'
            }
            onClick={() => setLoc('/login')}
          >
            <i className="fas fa-sign-in-alt"></i> Sign In
          </Link>


          <span className="nav-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </span>

        </Nav>
      </BootNav.Collapse>

    </BootNav>
  );
}

export default Navbar;