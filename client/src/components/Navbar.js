import { Link } from 'react-router-dom';
import { Nav, Navbar as BSNavbar } from 'react-bootstrap';
import { LOGOUT } from '../utils/actions';
import { useStoreContext } from '../utils/GlobalState';

const LoggedIn = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();

  return (
    <>
      <Link to="/profile" className="nav-link">
        <i className="fas fa-user-lock"></i> Profile
      </Link>
      <Link
        to="#"
        className="nav-link"
        onClick={() => dispatch({ action: LOGOUT })}
      >
        <i className="fas fa-sign-out-alt"></i> Logout
      </Link>
    </>
  );
};

const LoggedOut = () => {
  return (
    <>
      <Link to="/login" className="nav-link">
        <i className="fas fa-sign-in-alt"></i> Login
      </Link>
      <Link to="/register" className="nav-link">
        <i className="fas fa-user-plus"></i> Register
      </Link>
    </>
  );
};

const Navbar = () => {
  const [state] = useStoreContext();

  return (
    <BSNavbar bg="light" expand="lg" className="mb-4">

      <Link to="/" className="navbar-brand">
        <i className="fas fa-home"></i> Home
      </Link>

      <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BSNavbar.Collapse id="basic-navbar-nav">

        {!state.authCheckComplete ? <></> :
          (
            <Nav className="ml-auto">
              {state.user.auth
                ? <LoggedIn />
                : <LoggedOut />
              }
            </Nav>
          )
        }

      </BSNavbar.Collapse>
    </BSNavbar>
  );
};

export default Navbar;
