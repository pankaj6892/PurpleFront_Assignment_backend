const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');

app.use(cors());

// app.get('/', function (req, res, next) {
//   res.json({ msg: 'This is CORS-enabled for all origins!' });
// });

connectDB();

// Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
