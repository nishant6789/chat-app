const express = require('express')
const users = require('../service/user.js')

const {encode} = require('../middleware/jwt.js')

const router = express.Router()

router.post('/login/:userId', encode, (req, res, next) => {
    return res.json({success : 1, authorization : req.authToken})
})

module.exports = router