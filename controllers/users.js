'use strict';

module.exports = {
  register: (req, res) => {
    console.log(req.body);
    res.send('Got it!');
  }
};
