'use strict';

const db = require('../models');
const mailer = require('../middleware/mailer');

module.exports = {
  email: async (req, res, next) => {
    res.status(202).send();
    const { email } = req.body;
    const userData = await db.User.findOne({ where: { email } });

    if (!userData) {
      return;
    }

    const { user_id } = userData;
    const resetCode = require('crypto').randomBytes(20).toString('hex');

    try {
      db.PassReset.upsert({ user_id, resetCode });
      mailer.sendPassReset(email, resetCode);
    } catch (err) {
      next(err);
    }
  }
}
