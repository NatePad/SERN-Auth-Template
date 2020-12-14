import {
  Nav,
  Navbar as BSNavbar
} from 'react-bootstrap';

const Navbar = () => {
  return (
    <BSNavbar bg="light" expand="lg">

      <BSNavbar.Brand href="/">Home</BSNavbar.Brand>

      <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BSNavbar.Collapse id="basic-navbar-nav">

        <Nav className="ml-auto">
          <Nav.Link href="/login"><i className="fas fa-sign-in-alt"></i> Login</Nav.Link>
          <Nav.Link href="/register"><i className="fas fa-user-plus"></i> Register</Nav.Link>
        </Nav>

      </BSNavbar.Collapse>
    </BSNavbar>
  )
}

export default Navbar;
