const jwt = require('jsonwebtoken');
const UserModel = require('../models/Users.js')
const SECRET_KEY = 'some-secret-key';

const decode = (req, res, next) => {
    try {
        if (!req.headers['authorization']) {
            return res.json({ success: 0, errorMessage: 'No access token provided' });
          }
        const accessToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.json({success : 0, errorMessage : error.message})
    }
}


const encode = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const user = await UserModel.findOne({"_id" : userId})
        const payload = {
            userId : user._id,
        }
        const authToken = jwt.sign(payload, SECRET_KEY);
        console.log("Authtoken", authToken)
        req.authToken = authToken;
        next();
    } catch (error) {
        return res.json({success : 0, errorMessage : error.message})
    }
}

module.exports = {
    decode,
    encode
}