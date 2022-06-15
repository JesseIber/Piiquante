const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const cors = require('cors');

const MY_PORT = process.env.PORT;
const authRoute = require('./routes/auth');
const sauceRoute = require('./routes/sauces');

require('./config/database');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoute);
app.use('/api/sauces', sauceRoute);

app.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT} : http://localhost:${MY_PORT}`));