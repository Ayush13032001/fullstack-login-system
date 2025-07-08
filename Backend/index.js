const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./Models/db');
const AuthRouter = require('./Routes/AuthRouter');
const ProdRouter = require('./Routes/ProdRouter');


const PORT = process.env.PORT;

    
app.use(bodyParser.json()); 
app.use(cors({
  origin: ['https://fullstack-login-system-1oaa.vercel.app'],
  credentials: true
}));
app.use('/auth' ,AuthRouter)
app.use('/products',ProdRouter)
