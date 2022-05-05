const express = require('express');
const cors = require('cors')
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const routes = require('../routes/router');
const bodyParser = require('body-parser')
const app = express();


app.use(bodyParser.json({extended: false}))
app.set('port',process.env.PORT || 3000);
app.use(express.urlencoded({extended:false}));  
app.use(express.json());
app.use(cors());
dotenv.config({path: `.env`});
app.use(cookieParser());
app.use('/api', routes)

/*app.use(function (req, res, next){
    if(!req.email){
        res.header('Cache-Control', 'private, no cache, no store, must-revalidate');
    }
    next();
})*/

app.listen(3000, () => {
    console.log('Servidor activo')
})
