const express = require("express");
const AuthRoute = express.Router();
const { refreshTokenHandler, revokeToken } = require('../Middleware/AuthenticateMiddleware');

AuthRoute.post("/refresh-token", refreshTokenHandler); 
AuthRoute.post("/revoke-token", revokeToken); 

module.exports = AuthRoute;
