const makeValidation = require('@withvoid/make-validation');
const UserModel = require('../models/Users.js');

const onGetAllUsers = async(req, res) => {
    try {
        const users = await UserModel.find({})
        return res.json({success : 1, message : users})
    } catch (error) {
        return res.json({success : 0, errorMessage : error.message})
    }
}

const onGetUserById = async(req, res) => {
    try {
        const user = await UserModel.findOne({"_id" : req.params.id})
        if(!user) {
            return res.json({success : 0, errorMessage : "No such user exist"})
        }
        return res.json({success : 1, message : user})
    } catch (error) {
        return res.json({success : 0, errorMessage : error.message})
    }
}

const onCreateUser = async(req, res) => {
    try {
        const validation = makeValidation(types => ({
            payload: req.body,
            checks: {
              name: { type: types.string },
              username: { type: types.string },
            }
          }));
          if (!validation.success) return res.json({success : 0, errorMessage : validation});
    
          const { name, username, password } = req.body;
          const user = await UserModel.create({name, username, password});
          return res.json({ success: 1, message : user });
    } catch (error) {
        return res.json({success : 0, errorMessage : error.message})
    }
}

const onDeleteUserById = async(req, res) => {
    
}

module.exports = {
    onGetAllUsers,
    onGetUserById,
    onCreateUser,
    onDeleteUserById
}