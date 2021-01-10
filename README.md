# SERN-Auth-Template

**S**QL, **E**xpress, **R**eact, and **N**ode.js

As a web developer working on multiple applications that require authentication, I want a template that I can utilize to quickly and efficiently add standardized authentication to any of my applications.

## Description:

This app is currently undergoing a rewrite/refactor. To view the old version, visit the [v1 branch here](https://github.com/NatePad/SERN-Auth-Template/tree/v1).

## Local Install:

Create a file named `.env` in the repo's root directory and give it the following contents in order to establish the necessary environment variables:

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

The URL_PREFIX is used by the emailer in order to generate clickable links. If you don't want to set this as an environment variable, you can hard code your url in `/middleware/mailer.js`.