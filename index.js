const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const driveRouter = require('./routes/driveRouter')
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({ origin: 'https://docs-sn.vercel.app', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/drive',driveRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
