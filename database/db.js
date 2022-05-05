const mysql = require('mysql');
require('dotenv').config();

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,//'localhost',
    user: process.env.DB_USER,//'root',
    password: process.env.DB_PASS,//'',
    database: process.env.DB_DATABASE,//'firstlogin'
})

conexion.connect( (error) => {
    if(error){
        console.log("Existe un error "+error)
    }
    console.log("Conexión exitosa")
})

module.exports = conexion