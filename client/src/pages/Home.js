import React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';

const Home = props => {
  return (
    <Jumbotron fluid>
      <Container>
        <h1>Authentication Template</h1>
        <p>
          This is an authentication template that is built for SQL, Express, React, and Node.js using
          the <a href="https://sequelize.org/" target="_blank" rel="noopener noreferrer">Sequelize ORM</a>.
          If you're viewing this app on Heroku, please note that this is for demonstration purposes only and
          the database may be dropped at any time.
        </p>

        <ul>
          <li>
            <a href="https://github.com/NatePad/SERN-Auth-Template" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
          </li>

          <li>
            <a href="https://sern-auth-template.herokuapp.com/" target="_blank" rel="noopener noreferrer">Live App on Heroku</a>
          </li>
        </ul>
      </Container>
    </Jumbotron>
  );
}

export default Home;