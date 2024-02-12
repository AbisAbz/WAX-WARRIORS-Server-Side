const express            = require('express');
const userRoute          = express();
const userController     = require('../Controllers/UserController');
const userAuthController = require('../Controllers/AuthController/userAuthController')
const authentication     = require('../Middlewares/AuthenticationMiddleware')

userRoute.post('/signup', userAuthController.userRegistration)
userRoute.get("/verify/:id/:token",userAuthController.verifyUser)
userRoute.post('/login', userAuthController.userLogin)  
userRoute.post('/api/googlesignup', userAuthController.googleSignUp)      
userRoute.post('/api/googlelogin',userAuthController.googlelogin)    
userRoute.post('/api/fetchprop', userController.fetchProperties)  
userRoute.post('/api/fetchuser', userController.fetchUserDetails)                       
userRoute.post('/api/updateuserdetail', userController.updateUserDetails)                       


module.exports = userRoute