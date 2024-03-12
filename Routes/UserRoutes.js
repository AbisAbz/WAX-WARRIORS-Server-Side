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
userRoute.get('/api/fetchprophome',userController.fetchprophome)  
userRoute.post('/api/fetchprop', userController.fetchProperties)  
userRoute.post('/api/fetchuser', userController.fetchUserDetails)                       
userRoute.post('/api/updateuserdetail', userController.updateUserDetails)  
userRoute.post('/api/fetchservice', userController.fetchAllService)   
userRoute.post('/api/postrating', userController.postRating) 
userRoute.post('/api/postbookingdata', userController.slotBooking)   
userRoute.post('/api/fetchAllAvailableTimes', userController.fetchAllAvailableTimes)    
userRoute.post('/api/payementprocedure', userController.payementprocedure)   
userRoute.put('/api/paymentsuccess', userController.paymentSuccess)    
userRoute.get('/bookingsummery/:id/:active', userController.fetchBookedSummary) 
userRoute.post("/api/summaryViewData" , userController.fetchSummaryViewData)
userRoute.post('/api/cancelbooking', userController.cancelBooking)


module.exports = userRoute