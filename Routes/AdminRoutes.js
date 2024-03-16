const express             = require('express')
const adminRoute          = express() 
const adminAuthController = require('../Controllers/AuthController/adminAuthController')
const adminController     = require('../Controllers/AdminController')
const { AdminAuth }      = require('../Middlewares/AuthenticationMiddleware')


adminRoute.post('/adminLogin', adminAuthController.adminLogin);
adminRoute.get('/api/users', AdminAuth, adminController.userList);
adminRoute.post('/userblock' ,AdminAuth, adminController.userblock);
adminRoute.get('/api/propertylist',AdminAuth, adminController.fetchProperty);
adminRoute.post('/api/aprove', AdminAuth,adminController.propertyAprove)
adminRoute.post('/api/rejectmail',AdminAuth, adminController.rejectMail)
adminRoute.get('/api/fetchdashboard', AdminAuth,adminController.fetchDash)

module.exports = adminRoute;
