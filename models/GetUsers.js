const sqlite3 = require('sqlite3').verbose();

const GetUsers = (param) => {
  try {
    const list = [];

    let db = new sqlite3.Database('./user.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the database.');
    });

    let sql = 'SELECT email FROM user_list WHERE email = "' + param + '"';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      list.push(...rows);
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
    });
    return list;
  } catch (err) {
    process.exit(1);
  }
};

module.exports = GetUsers;
