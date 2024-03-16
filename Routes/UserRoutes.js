const express            = require('express');
const userRoute          = express();
const userController     = require('../Controllers/UserController');
const userAuthController = require('../Controllers/AuthController/userAuthController')
const { UserAuth }     = require('../Middlewares/AuthenticationMiddleware')

userRoute.post('/signup', userAuthController.userRegistration)
userRoute.get("/verify/:id/:token",userAuthController.verifyUser)
userRoute.post('/login', userAuthController.userLogin)  
userRoute.post('/api/googlesignup', userAuthController.googleSignUp)      
userRoute.post('/api/googlelogin',userAuthController.googlelogin)  
userRoute.get('/api/fetchprophome',userController.fetchprophome)  
userRoute.post('/api/fetchprop', userController.fetchProperties)  
userRoute.post('/api/fetchuser',UserAuth, userController.fetchUserDetails)                       
userRoute.post('/api/updateuserdetail',UserAuth, userController.updateUserDetails)  
userRoute.post('/api/fetchservice',UserAuth, userController.fetchAllService)   
userRoute.post('/api/postrating',UserAuth, userController.postRating) 
userRoute.post('/api/postbookingdata',UserAuth, userController.slotBooking)   
userRoute.post('/api/fetchAllAvailableTimes',UserAuth, userController.fetchAllAvailableTimes)    
userRoute.post('/api/payementprocedure',UserAuth, userController.payementprocedure)   
userRoute.put('/api/paymentsuccess', UserAuth,userController.paymentSuccess)    
userRoute.get('/bookingsummery/:id/:active',UserAuth, userController.fetchBookedSummary) 
userRoute.post("/api/summaryViewData" ,UserAuth, userController.fetchSummaryViewData)
userRoute.post('/api/cancelbooking',UserAuth, userController.cancelBooking)


module.exports = userRoute