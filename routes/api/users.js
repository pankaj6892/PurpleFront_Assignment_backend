const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const SetUser = require('../../models/SetUser');
const sqlite3 = require('sqlite3').verbose();

/*
 * @route    POST api/users
 * @desc     Test route
 * @access   Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('phone', 'Please enter valid contact number').isLength({
      min: 10,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, email, password, phone } = req.body;

    try {
      let db = new sqlite3.Database('./user.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        // console.log('Connected to the database.');
      });

      password = bcrypt.hashSync(password, 10);

      let sql = 'SELECT email FROM user_list WHERE email = "' + email + '"';

      await db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }

        if (rows.length !== 0) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        } else {
          const user = { name, email, password, phone };

          SetUser(user);

          const payload = {
            user: {
              id: user.email,
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
      });
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = router;
