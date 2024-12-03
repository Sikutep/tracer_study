const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    role : {
        require : true,
        unique : true,
        type : String
    }
})

module.exports = mongoose.model("role", RoleSchema)