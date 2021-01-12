import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const Home = () => {
  return (
    <Container>
      <h1>SERN Authentication Template</h1>

      <p>
        This authentication template uses SQL, Express, React, and Node.js.
      </p>

      <p>
        Code:
        <a
          href="https://github.com/NatePad/SERN-Auth-Template"
          target="_blank"
          rel="noreferrer"
        >
          &nbsp;GitHub
        </a>
      </p>
      
      <p> Protected Route: <Link to="/profile">Profile Page</Link></p>
    </Container>
  );
};

export default Home;
