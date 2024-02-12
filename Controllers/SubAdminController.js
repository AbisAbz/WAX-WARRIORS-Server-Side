const { log } = require('util')
const Property = require('../Models/PropertyModel')
const Service = require('../Models/ServiceModel')
const { uploadToCloudinary, multiUploadCloudinary } = require('../Utils/Cloudinary')

const RegProperty = async (req, res) => {
    try {
        const propData = req.body
        const img = req.files
        const uploadImages = await multiUploadCloudinary(img, "images")
        console.log("iam the resposne of  the uploadImages", uploadImages);

        const newProperty = new Property({
            subAdminId   : propData.id,
            propertyName : propData.name,
            slot         : propData.slot,
            country      : propData.country,
            state        : propData.state,
            district     : propData.district,
            location     : propData.location,
            mobile       : propData.mobile,
            description  : propData.describe,
            status       : propData.status,
            images       : uploadImages
        })
        const propsvg = await newProperty.save();
        if(!propsvg) return res.status(400).json({ message:'Something went wrong'});
        else return res.status(200).json({message:'Your Property has been created', propsvg})



    } catch (error) {
        console.log(error);
    }
}


const fetchProperty = async (req, res) => {
    try {
        const { id } = req.body
        const data = await Property.find({ subAdminId: id });
        if (!data) console.log("no data in this id");
        else return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
    }
}

const fetchDetailsViewpge = async (req, res) => {
    try {
        const { id } = req.body
        const data = await Property.findById({ _id: id })
        if (!data) return res.status(400).json({ message: 'Something went wrong' });
        else return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
    }
}

const postServiceData = async (req, res) => {
    try {
        const serviceData = req.body
        const newService = new Service({
            propertyId: serviceData.id,
            serviceName: serviceData.name,
            price: serviceData.price,
            description: serviceData.description,
        })
        const saveService = await newService.save();

        if (!saveService) return res.status(400).json({ message: 'Something went wrong' });
        else return res.status(200).json({ message: 'Your Property has been created', saveService })
    } catch (error) {
        console.log(error);
    }
}

const fetchAllServicesData = async (req, res) => {
    try {
        const data = await Service.find()
        console.log("aim the reposne of the all data fetching ", data);
        if (!data) return res.status(400).json({ message: 'No service Data' });
        else return res.status(200).json({ data });
    } catch (error) {
        console.log(error);
    }
}

const fetchAllProperty = async(req, res) => {
    try {
        console.log("iam in the back-end of the fetchAllProperty");
        const data  = await Property.find();
        console.log("iam the data of the all property ", data);
        return res.status(200).json({ data });
    } catch (error) {
        console.log(error);
    }
}





module.exports = {
    RegProperty,
    fetchProperty,
    fetchDetailsViewpge,
    postServiceData,
    fetchAllServicesData,
    fetchAllProperty,
}



