const express = require('express')
const { getAll, createUser, editUser, deleteUser, searchUser } = require('../Controllers/UserController')
const { addRole } = require('../Controllers/RoleController')


const UserRouter = express.Router()

UserRouter.get('/all', getAll)
// UserRouter.get('/searchuser', searchUser)
UserRouter.post('/adduser', createUser)
UserRouter.put('/edituser/:id', editUser)
UserRouter.delete('/deleteuser/:id', deleteUser)


UserRouter.post('/addrole', addRole)

module.exports = UserRouter

