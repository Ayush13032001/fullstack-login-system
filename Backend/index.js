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
app.use(cors());
app.use('/auth' ,AuthRouter)
app.use('/products',ProdRouter)
app.listen(PORT , () => {
    console.log(`Server is running ${PORT}`)
})