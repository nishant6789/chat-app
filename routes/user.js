const express = require('express');

const user = require('../service/user.js');

const router = express.Router();

router.get('/', user.onGetAllUsers)
router.post('/', user.onCreateUser)
router.get('/:id', user.onGetUserById)

module.exports = router