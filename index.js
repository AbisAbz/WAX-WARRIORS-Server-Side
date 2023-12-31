const express     = require('express');
const app         = express();
const mongoose    = require('mongoose');
const userRouter  = require('./Routes/UserRoutes');
const adminRouter = require('./Routes/AdminRoutes')
const config      = require('./Config/config');
const cors        = require('cors'); 
const crypto      = require('crypto'); 
const env         = require('dotenv');
const userRoute   = require('./Routes/UserRoutes');
const adminRoute  = require('./Routes/AdminRoutes');
const propertyRoute = require('./Routes/PropertyRoutes')
require('dotenv').config();
env.config();

mongoose.connect('mongodb://127.0.0.1:27017/MrWash');

// Use middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true, 
}));



app.use('/', userRouter);
app.use('/admin', adminRoute)
app.use('/property', propertyRoute)

app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT}`));
