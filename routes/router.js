const express = require('express')
const router = express.Router()
const controller = require('../controllers/authcontroller')


router.post('/login', controller.login)

router.post('/register', controller.register)
 
//router.delete('/:id', )

//router.put('/:id',controller.updateregister)

module.exports = router;