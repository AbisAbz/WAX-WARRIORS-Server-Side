const express       = require('express')
const propertyRoute = express();
const propertyAuthController = require('../Controllers/AuthController/propertyAuthControll')
const subAdminController = require('../Controllers/SubAdminController')


propertyRoute.post('/propsignup', propertyAuthController.PropertyRegistration);
propertyRoute.get('/verifysub/:id/:token', propertyAuthController.verifyPropertyOwner)
propertyRoute.post('/proplogin', propertyAuthController.propLogin)
propertyRoute.post('/propreg', subAdminController.RegProperty)
propertyRoute.post('/api/propdata' ,subAdminController.fetchProperty)
propertyRoute.post('/api/propview' ,subAdminController.fetchDetailsViewpge)
propertyRoute.post('/api/service' ,subAdminController.postServiceData)
propertyRoute.get('/api/fetchallservice' ,subAdminController.fetchAllServicesData)


module.exports = propertyRoute