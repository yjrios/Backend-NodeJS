const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')
const {STATUS_CODES} = require('http')
const { rmSync } = require('fs')


exports.login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        console.log('email '+ email+' pass '+password)
        if( email ){ 

            conexion.query('SELECT * FROM DATA WHERE EMAIL = ?', [email], async (error, result) =>{
                if(error){
                    res.statusCode = 404
                    res.error = error
                }
                if(result.length == 0) {
                    console.log('404')
                    res.statusCode = 404
                    return res.end()
                    
                }else if(password){
                    console.log('Password')
                    let TrueFalse = bcryptjs.compare(password, result[0].password, (error, res)=>{
                        if(error){console.log(error)}
                    })

                    if(!TrueFalse){
                        console.log('401')
                        res.statusCode = 401
                        return res.end()
                    }else{
                        console.log('JWT')
                        const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRACION
                        })
                        const cookiesOption = {
                            expires: new Date(Date.now()+process.env.JWT_COOKIE *24*60*60*1000)
                        }
                        res.cookie('jwt', token, cookiesOption)
                        res.json(result)
                        return res.end()
                    }
                }else{
                    console.log('Password empty')
                    res.statusCode = 500
                    return res.end()
                }
            })
        }
    }catch(error) {
        console.log(error)
        res.statusCode = 500
        return res.end()
    }
}

exports.isAuthenticated = async (req, res, next) =>{
    try {
        if(req.cookies.jwt){
            try {
                const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
                conexion.query('SELECT * FROM DATA WHERE ID = ?', [decodificada.id], (error, result) =>{
                    if(!result){return next()}
                    req.email = result[0]
                    return next()
                })
            } catch (error) {
                console.log(error)
                return next()
            }
        }
    } catch (error) {
        console.log(error)
    }
}

exports.register = async (req, res) => {
    try {
        console.log('BODY EMAIL '+req.body.email+' BODY PASS '+req.body.password)

        const email = req.body.email
        const password = req.body.password

        console.log('emal '+email+' pass '+password)

        let passhash = await bcryptjs.hash(password, 8 )

        conexion.query('INSERT INTO DATA SET ?', { email: email, password: passhash}, (error, result) => {
            if(error) {
                console.log('ERROR AL INSERTAR' +error)
            }else{
                res.statusCode = 200
                return res.end()
            }
        })
    } catch(error){
        console.log(error)
        return res.end()
    }
}

exports.logOut = (req, res) => {
    res.clearCookie('jwt')
}

exports.updateregister = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        console.log('email '+ email)
    
        conexion.query('SELECT * FROM DATA WHERE EMAIL = ?', {email}, async (error, result) =>{
           console.log('error query '+result)
            if(result.length == 0) {
                console.log('404')
                res.statusCode = 404
                return res.end()
                
            }else if( password ){
                console.log('Password')
                let TrueFalse = bcryptjs.compare(password, result[0].password, (error, res)=>{
                    if(error){console.log(error)}
                })
                if(!TrueFalse){
                    console.log('400')
                    res.statusCode = 400
                    return res.end()
                }else{
                    const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRACION
                    })
                    const cookiesOption = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE *24*60*60*1000)
                    }
                    res.cookie('jwt', token, cookiesOption)
                    res.json(result)
                    return res.end()
                }
            }else{
                console.log('Password empty')
                res.statusCode = 500
                return res.end()
            }
        })
    } catch (error) {
        console.log(error)
        res.error(error)
        }
}    
