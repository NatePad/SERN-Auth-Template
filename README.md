# SERN-Auth-Template

**S**QL, **E**xpress, **R**eact, and **N**ode.js

As a web developer working on multiple applications that require authentication, I want a template that I can utilize to quickly and efficiently add standardized authentication to any of my applications.

## Work in Progress, MVP Goals:

* ✔️ Front end input validation
* ❌ Back end data validation
* ❌ New user registration functionality
* ❌ Sign In functionality
* ❌ Sign Out functionality
* ❌ A ProtectedRoute React component

## Description:

This template uses the **MVC** design pattern.

The MySQL user table uses an **unsigned** auto-incremented primary key. This primary key is used to generate an authentication cookie via [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).

**Data validation** happens on both the front end (`/client/utils/inputValidator.js`) for **good UX** and on the back end to ensure **clean data**. Unique usernames and email addresses are verified with user friendly messages.

## Technologies Used:

* MySQL database **CRUD functions** via [Sequelize ORM](https://sequelize.org/)
    * [Documentation](https://sequelize.org/v5/)
    * [API Reference](https://sequelize.org/v5/identifiers.html)
* [Express](https://expressjs.com/) web framework utilized to build **RESTful API** routing
    * [API Reference](https://expressjs.com/en/api.html)
* [React](https://reactjs.org/) library provides front end UI
    * [Documentation](https://reactjs.org/docs/getting-started.html)
* [Node.js](https://nodejs.org/en/) runtime environment

### Other Technologies:

* **Bootstrap** version 4.4.1 is currently served via StackPath CDN. Both vanilla Bootstrap and React Bootstrap are included.
    * As required by Bootstrap:
        * jQuery slim v 3.4.1
        * Popper.js v 1.16.0
* **FontAwesome** free version 5.13.0 (CSS version) is hosted locally.
* **Google Fonts** is used to provide the Roboto font to the user experience.

## Installation:

The database will need to be created manually. Sequelize will automatically create the user table.

Create the necessary `/.env` file and provide the following environment variables:

```
JWT_SECRET=whatever_you_want

DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=name_of_your_database
DB_HOST=ip_address_of_database_host
```

### An additional Note:

* As this template deals with confidential information such as user passwords, be sure to obtain a security certificate and redirect from http:// to https:// routes in production.

## FAQ:

* Q: Why SQL instead of Mongo?

    * A: Simply because most hosting providers offer SQL as part of a shared hosting package while Mongo requires VPS services.

* Q: How are passwords handled?

    * A: Passwords are encrypted with [bcrypt](https://www.npmjs.com/package/bcrypt) before being stored in the database.
