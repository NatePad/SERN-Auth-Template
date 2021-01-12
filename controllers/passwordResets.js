'use strict';

const db = require('../models');
const mailer = require('../middleware/mailer');

module.exports = {
  email: async (req, res, next) => {
    res.status(202).send();
    const { email } = req.body;

    const userData = await db.User.findOne({ where: { email } });
    if (!userData) return;
    const { user_id } = userData;
    const resetCode = require('crypto').randomBytes(20).toString('hex');

    try {
      db.PassReset.upsert({ user_id, resetCode });
      mailer.sendPassReset(email, resetCode);
    } catch (err) {
      next(err);
    }
  },

  reset: async (req, res, next) => {
    const { password, resetCode } = req.body;
    try {
      const results =
        await db.PassReset.findOne({
          where: { resetCode },
          include: db.User
        });

      if (!results) {
        res.status(200).send();
        return;
      }

      // 10 MINUTE EXPIRATION
      if (new Date() - results.updatedAt < 600000) {
        results.User.update({ password });
        res.status(200).send('SUCCESS');
      } else {
        res.status(200).send();
      }
      results.destroy();
    } catch (err) {
      next(err);
    }
  }
}
