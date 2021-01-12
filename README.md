# SERN-Auth-Template

**S**QL, **E**xpress, **R**eact, and **N**ode.js

As a web developer working on multiple applications that require authentication, I want a template that I can utilize to quickly and efficiently add standardized authentication to any of my applications.

The live app is hosted by Heroku at [sern-auth-template.herokuapp.com](https://sern-auth-template.herokuapp.com/).

## Description:

This template uses the **MVC** design pattern.

The user table uses an **unsigned** auto-incremented primary key. This primary key is used to generate an authentication cookie via [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken). This cookie is checked when accessing the site so that returning users don't need to log in again. The state of this asynchronous authentication check is saved via React's Context API in a store.

**Data validation** happens on both the front end in the relevant components for **good UX** and on the back end in the Sequelize models in order to ensure **clean data**.

Finally, **nodemailer** is used to send password reset emails with a clickable link that expires in 10 minutes.

## Technologies Used:

* SQL database **CRUD functions** via [Sequelize ORM](https://sequelize.org/)
    * [Documentation](https://sequelize.org/v5/)
    * [API Reference](https://sequelize.org/v5/identifiers.html)
* [Express](https://expressjs.com/) web framework utilized to build **RESTful API** routing
    * [API Reference](https://expressjs.com/en/api.html)
* [React](https://reactjs.org/) library provides front end UI
    * [Documentation](https://reactjs.org/docs/getting-started.html)
* [Node.js](https://nodejs.org/en/) runtime environment

### Other Technologies:

* **Bootstrap** version 4.5.3 is hosted locally. Both vanilla Bootstrap and React Bootstrap are included.
* **FontAwesome** free version 5.15.1 (CSS version) is hosted locally.
* **Nodemailer** is used to send password reset emails.
* **Bcrypt** is used to hash passwords before database storage.
* **JSON Web Token** is used to tokenize authorization cookies.

## Local Installation and Usage:

This app is currently set to use a MySQL database. If you prefer to use Postgres, MariaDB, or SQLite, change the Sequelize "dialect" value in `/models/index.js` accordingly.

Your database will need to be created manually. Sequelize will automatically create the necessary tables.

Please be aware that Nodemailer doesn't work seamlessly when sending mail from a Gmail account. See [this article](https://nodemailer.com/usage/using-gmail/) for more information.

Create the necessary `/.env` file and provide the following environment variables:

```
JWT_SECRET=whatever_you_want

DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=name_of_your_database
DB_HOST=ip_address_of_database_host

EMAIL_FROM=SERN Auth Template
EMAIL_HOST=smtp.yourmailserver.com
EMAIL_USER=your@emailaddress.com
EMAIL_PASS=your_email_password

URL_PREFIX=https://www.YourWebSite.com
```

The URL_PREFIX env var is used by the emailer in order to generate clickable links. If you don't want to set this as an environment variable, you can hard code your url in `/middleware/mailer.js`.

### An Additional Note:

* As this template deals with **confidential information** such as user passwords, be sure to obtain a security certificate and **redirect from http:// to https://** routes in production.

## FAQ:

* Q: Why SQL instead of Mongo?

    * A: Simply because most hosting providers offer SQL as part of a shared hosting package while Mongo requires VPS services.

* Q: How are passwords handled?

    * A: Passwords are encrypted with [bcrypt](https://www.npmjs.com/package/bcrypt) before being stored in the database.
