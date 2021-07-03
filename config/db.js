const sqlite3 = require('sqlite3').verbose();

const connectDB = () => {
  try {
    let db = new sqlite3.Database('./user.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      // console.log('Connected to the database.');
    });

    db.run(
      'CREATE TABLE IF NOT EXISTS user_list (name text NOT NULL, email text NOT NULL PRIMARY KEY, password text NOT NULL, phone text NOT NULL);',
      function (err) {
        if (err) {
          return console.log(err.message);
        }
      }
    );

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      // console.log('Close the database connection.');
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
