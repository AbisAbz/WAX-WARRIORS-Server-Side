const { log } = require('util');
const Property = require('../Models/PropertyModel');
const Service = require('../Models/ServiceModel');
const booking = require('../Models/BookingModel');
const moment = require('moment');
require('moment-timezone');
const { uploadToCloudinary, multiUploadCloudinary } = require('../Utils/Cloudinary')

const RegProperty = async (req, res) => {
    try {
        const propData = req.body
        const img = req.files
        const uploadImages = await multiUploadCloudinary(img, "images")

        const newProperty = new Property({
            subAdminId   : propData.id,
            propertyName : propData.name,
            slot         : propData.slot,
            country      : propData.country,
            state        : propData.state,
            district     : propData.district,
            location     : propData.location,
            openingTime  : propData.openingTime,
            closingTime  : propData.closingTime,
            mobile       : propData.mobile,
            description  : propData.describe,
            status       : propData.status,
            images       : uploadImages,
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
        const { id } = req.body
        const data = await Service.find({propertyId:id})
        if (!data) return res.status(400).json({ message: 'No service Data' });
        else return res.status(200).json({ data });
    } catch (error) {
        console.log(error);
    }
}

const fetchAllProperty = async(req, res) => {
    try {
        const data  = await Property.find();
        return res.status(200).json({ data });
    } catch (error) {
        console.log(error);
    }
}

const editPropDetails = async(req, res) => {
    try {
        const prodData = req.body
        const updateProp = await Property.updateOne({_id:prodData.propId}, {$set:{
            name:prodData.name,
            slot:prodData.slot,
            country:prodData.country,
            state:prodData.state,
            district:prodData.district,
            location:prodData.location,
            mobile:prodData.mobile,
            openingTime:prodData.openingTime,
            closingTime:prodData.closingTime,
            description:prodData.describe
        }})

        if(updateProp.modifiedCount > 0 ){
            return res.status(200).json({message:"successfully updated"})
        }
        
    } catch (error) {
        console.log(error);
    }
}

const hidePropertyCntrl = async(req, res) => {
    try {
        const {id} = req.body
        const propData = await Property.findById({_id:id})
        const updateIsVisible = await Property.updateOne({_id:id}, {$set:{is_visible:!propData.is_visible}})
        if(updateIsVisible.modifiedCount > 0){
            if(!propData.is_visible === true){
                return res.status(200).json({message:"succefully updated Now your Property is Visible"})
            }else{
                return res.status(200).json({message:"succefully updated now Your Property is hidden"})
            }
            
        }else{
            return res.status(400).json({message:"Something went Wrong"})
        }
        
    } catch (error) {
        console.log(error);
    }
}


const fetchAllBookings = async(req, res) => {
    try {
        const { id } = req.body
        const data = await booking.find({ subAdminId: id }).populate("subAdminId").populate("propertyId").populate("UsersId")
            return res.status(200).json({data})
    } catch (error) {
        console.log(error);
    }
}

const fetchAllDataDash = async (req, res) => {
    try {
        const { id } = req.body
        const data = await booking.find({ subAdminId: id })
        if (data) {
            const totalUsers = new Set(data.map(booking => booking.UsersId.toString())).size;

            const now = moment().tz('Asia/Kolkata');
            const currentMonth = now.month() + 1;
            const currentYear = now.year();

            const months = [currentMonth, currentMonth + 1, currentMonth + 2];

            const totalRevenueByMonth = months.map(month => {
                const adjustedMonth = month > 12 ? month - 12 : month;
                const adjustedYear = month > 12 ? currentYear + 1 : currentYear;

                const monthDate = moment.tz({ year: adjustedYear, month: adjustedMonth - 1, date: 1 }, 'Asia/Kolkata');
                const monthName = monthDate.format('MMMM');

                const monthlyRevenue = data
                    .filter(booking => {
                        const [bookingMonth, bookingYear] = booking.date.split('-').map(Number);
                        const bookingDateTime = moment.tz(booking.date + ' ' + booking.time, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
                        return bookingMonth === adjustedMonth && bookingYear === adjustedYear && bookingDateTime.isBefore(now) && booking.bookingStatus === 'success';
                    })
                    .reduce((total, booking) => total + booking.TotalRate, 0);

                return { month: monthName, year: adjustedYear, revenue: monthlyRevenue };
            });

            const totalSales = data
                .filter(booking => {
                    const bookingDateTime = moment.tz(booking.date + ' ' + booking.time, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
                    return bookingDateTime.isBefore(now) && booking.bookingStatus === 'success';
                })
                .reduce((total, booking) => total + booking.TotalRate, 0);

            return res.status(200).json({ totalUsers: totalUsers, totalBooking: data.length, totalRevenue: totalRevenueByMonth, totalSales: totalSales })

        }
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
    editPropDetails,
    hidePropertyCntrl,
    fetchAllBookings,
    fetchAllDataDash,
}



