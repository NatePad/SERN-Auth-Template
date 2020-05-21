import React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';

const Home = props => {
  return (
    <Jumbotron fluid>
      <Container>
        <h1>Authentication Template</h1>
        <p>
          This is an authentication template that is built on MySQL, Express, React, and Node.js using
          the <a href="https://sequelize.org/" target="_blank" rel="noopener noreferrer">Sequelize ORM</a>.
        </p>
      </Container>
    </Jumbotron>
  );
}

export default Home;