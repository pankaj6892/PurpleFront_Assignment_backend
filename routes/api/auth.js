const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();

/*
 * @route    POST api/users
 * @desc     Test route
 * @access   Public
 */
router.post(
  '/',
  [
    check('userId', 'Invalid Credentials').isEmail(),
    check('password', 'Invalid Credentials').isLength({ min: 6 }),
  ],
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }

    let { userId, password } = req.body;

    try {
      let db = new sqlite3.Database('./user.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        // console.log('Connected to the database.');
      });

      let sql = 'SELECT * FROM user_list WHERE email = "' + userId + '"';
      let user = {};

      await db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }

        if (rows.length === 0) {
          return res
            .status(200)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        } else {
          user = {
            email: rows[0].email,
            password: rows[0].password,
          };

          let isMatch = bcrypt.compareSync(password, user.password);

          if (!isMatch) {
            return res
              .status(200)
              .json({ errors: [{ msg: 'Invalid Credentials' }] });
          } else {
            const payload = {
              user: {
                id: user.userId,
              },
            };

            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = router;
