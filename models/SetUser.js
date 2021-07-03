const sqlite3 = require('sqlite3').verbose();

const SetUser = (param) => {
  try {
    let db = new sqlite3.Database('./user.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      // console.log('Connected to the database.');
    });

    db.run(
      `INSERT INTO user_list(name, email, password, phone) VALUES(?,?,?,?)`,
      [param.name, param.email, param.password, param.phone],
      function (err) {
        if (err) {
          return console.log(err.message);
        }

        // console.log(`A row has been inserted with rowid ${this.lastID}`);

        return 1;
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
    return 0;
  }
};

module.exports = SetUser;
