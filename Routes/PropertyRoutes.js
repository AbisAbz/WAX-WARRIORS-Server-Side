const express       = require('express')
const propertyRoute = express();
const propertyAuthController = require('../Controllers/AuthController/propertyAuthControll')
const subAdminController = require('../Controllers/SubAdminController')
const multerUpload = require('../Middlewares/multer');


propertyRoute.post('/propsignup', propertyAuthController.PropertyRegistration);
propertyRoute.get('/verifysub/:id/:token', propertyAuthController.verifyPropertyOwner)
propertyRoute.post('/proplogin', propertyAuthController.propLogin)
propertyRoute.post('/propreg', multerUpload.array("images", 5), subAdminController.RegProperty);
propertyRoute.post('/api/propdata' ,subAdminController.fetchProperty)
propertyRoute.post('/api/propview' ,subAdminController.fetchDetailsViewpge)
propertyRoute.post('/api/service' ,subAdminController.postServiceData)
propertyRoute.get('/api/fetchallservice' ,subAdminController.fetchAllServicesData)
propertyRoute.get('/api/fetchPropertyOwner' ,subAdminController.fetchAllProperty)


module.exports = propertyRoute