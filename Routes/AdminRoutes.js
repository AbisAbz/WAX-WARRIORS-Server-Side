const express             = require('express')
const adminRoute          = express() 
const adminAuthController = require('../Controllers/AuthController/adminAuthController')
const adminController     = require('../Controllers/AdminController')
const authentication      = require('../Middlewares/AuthenticationMiddleware')


adminRoute.post('/adminLogin', adminAuthController.adminLogin);
adminRoute.get('/api/users', authentication.AdminAuth , adminController.userList);
adminRoute.post('/userblock' ,adminController.userblock);
adminRoute.post('/api/propertylist',authentication.AdminAuth, adminController.fetchProperty);
adminRoute.post('/api/aprove', adminController.propertyAprove)
adminRoute.post('/api/rejectmail', adminController.rejectMail)

module.exports = adminRoute;
