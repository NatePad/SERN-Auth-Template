const handleResponse = (response, username, email) => {
  switch(response) {
    case 'BAD_REQUEST':
      return `Some of your data was not accepted by the server. Please try registering again.`;
    case 'DUPLICATE_EMAIL':
      return `The email address ${email} has been taken.`;
    case 'DUPLICATE_USERNAME':
      return `The username ${username} has already been taken.`;
    case 'JWT_ERROR':
      return `Please inform the site administrator that there is an issue with the JWT_SECRET.`;
    case 'SERVER_ERROR':
      return `Uhoh. It looks like something went wrong on the server. Please try registering again later.`;
    default:
      return `The server has sent an unexpected response. This is awkward.`;
  }
}

module.exports = handleResponse;
