const jwt      = require('jsonwebtoken')
const User     = require('../Models/UserModel')
const Property = require('../Models/PropertyModel')
const Service  = require('../Models/ServiceModel')
const Rating   = require('../Models/ReviewModel')
const Booking  = require('../Models/BookingModel')
const Stripe   = require('stripe')
const moment = require('moment-timezone');
const { ObjectId } = require('mongodb')
const { log } = require('util')



const fetchprophome = async (req, res) => {
    try {
  
      const fetchData = await Property.find();
      let len = fetchData.length;
  
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
          if (fetchData[j] < fetchData[j + 1]) {
            const temp = fetchData[j];
            fetchData[j] = fetchData[j + 1];
            fetchData[j + 1] = temp;
          }
        }
      }
      res.status(200).json({ data: fetchData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


  const fetchProperties = async (req, res) => {
    try {
        const { rating, search } = req.body;

        let findData = await Property.find({status:"approved"});
        let data = findData;

        if (rating > 0) {
            if (search === 0) {
                data = findData.filter(e => e.avgRating === rating);
            } else {
              data = findData.filter(e =>
                  e.avgRating === rating &&
                  (e.propertyName.toLowerCase().includes(search.toLowerCase()) ||
                  e.country.toLowerCase().includes(search.toLowerCase()) ||
                  e.state.toLowerCase().includes(search.toLowerCase()) ||
                  e.district.toLowerCase().includes(search.toLowerCase()) ||
                  e.location.toLowerCase().includes(search.toLowerCase()))
              );
              
            }
        } else {
            if (search !== 0) {
                data = findData.filter(e =>
                    e.propertyName.toLowerCase().includes(search.toLowerCase()) ||
                    e.country.toLowerCase().includes(search.toLowerCase()) ||
                    e.state.toLowerCase().includes(search.toLowerCase()) ||
                    e.district.toLowerCase().includes(search.toLowerCase()) ||
                    e.location.toLowerCase().includes(search.toLowerCase())
                );
            }
        }

        if (data.length > 0) {
            return res.status(200).json({ data });
        } else {
            return res.status(200).json({ message: 'No Properties found' , data});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const fetchUserDetails = async(req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) return res.status(400).json({message:'token expires please login'})
        else {
            const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
             const userId = decodeToken.userId
             const data = await User.findById({_id:userId})
             if(!data) return res.status(400).json({message:'No data found  please login Once again'})
             else {
             return res.status(200).json({data})
            }
        }


    } catch (error) {
        console.log(error); 
    }
}

const updateUserDetails = async(req, res) => {
    try {
        const userDatas = req.body.values
        const userId = await User.findById(req.body.id)
        
        const updateUser = await User.updateOne({_id:userId}, {$set:{name:userDatas.name, mobile:userDatas.mobile, district:userDatas.district, 
                                                            houseName:userDatas.houseName, state:userDatas.state, email:userDatas.email}})
           
            if(updateUser.modifiedCount > 0) return res.status(200).json({message:'Successfuly updated'})
            else{
              return res.status(400).json({message:'Something went occur please update Once again'})
            }
        
    } catch (error) {
        console.log(error);
    }
}


const fetchAllService = async(req, res) => {
    try {
        const id = req.body.id
        const servicePromise = Service.find({ propertyId: id }).exec();
        const ratingPromise = Rating.find({ propertyId: id }).populate('UsersId').exec();
        const slotBookingsPromise =  Booking.find({ propertyId: id }).exec();
        const currentPropertyPromise =  Property.findById({ _id: id }).exec();
        
        const [serviceData, ratingData, slotBookings, propertyDetails] = await Promise.all([servicePromise, ratingPromise, slotBookingsPromise,currentPropertyPromise]);


 const currentDate = new Date()

 const pendingWorks = slotBookings.filter((e) => {
    const dateTimeString = `${e.date} ${e.time}`;
    const dateTime = new Date(dateTimeString);
    return dateTime >= currentDate;
});


const slotNotAvailable = pendingWorks.reduce((acc, e) => {
    const DateTimeString = `${e.date} ${e.time}`;
    const DateTime = new Date(DateTimeString);

  
    if (e.checked) {
        return acc;
    }

    const count = pendingWorks.reduce((count, k) => {
        const kDateTimeString = `${k.date} ${k.time}`;
        const kDateTime = new Date(kDateTimeString);

        if (DateTime.getTime() === kDateTime.getTime()) {
            k.checked = true;
            return count + 1;
        } else {
            return count;
        }
    }, 0);

    if(count >= propertyDetails.slot){
    acc.push({
        date: e.date,
        time: e.time,
        count: count,
    });
}

    return acc;
}, []);


        if(!serviceData){
            if(!slotNotAvailable){
            if(!ratingData){
                const avgRating = 0;
                return res.status(400).json({avgRating})
            }else{
                let sum = 0;
                let count = 0;
                
                ratingData.map((e) => {
                  sum = sum + e.ReviewRating;
                  count++;
                });
                
                const avgRating = Math.floor(sum / count);
                return res.status(200).json({ratingData,avgRating})
            }
        }else{
            if(!ratingData){
                const avgRating = 0;
                return res.status(400).json({ slotNotAvailable,avgRating })
            }else{
                let sum = 0;
                let count = 0;
                
                ratingData.map((e) => {
                  sum = sum + e.ReviewRating;
                  count++;
                });
                
                const avgRating = Math.floor(sum / count);
                return res.status(200).json({ ratingData, slotNotAvailable, avgRating })
            }
        }
    }else{
        if(!slotNotAvailable){
            if(!ratingData){
                const avgRating = 0;
                return res.status(400).json({avgRating, serviceData})
            }else{
                let sum = 0;
                let count = 0;
                
                ratingData.map((e) => {
                  sum = sum + e.ReviewRating;
                  count++;
                });
                
                const avgRating = Math.floor(sum / count);
                return res.status(200).json({ratingData,avgRating, serviceData})
            }
        }else{
            if(!ratingData){
                const avgRating = 0;
                return res.status(400).json({ slotNotAvailable,avgRating , serviceData})
            }else{
                let sum = 0;
                let count = 0;
                
                ratingData.map((e) => {
                  sum = sum + e.ReviewRating;
                  count++;
                });
                
                const avgRating = Math.floor(sum / count);
                return res.status(200).json({ ratingData, slotNotAvailable, avgRating , serviceData})
            }
        }

    }

    } catch (error) {
    console.log(error);
    }
}

const postRating = async(req, res) => {
    try {
      const ratingDatas = req.body
        if(!ratingDatas)  return res.status(400).json({message:'Something error occured please rate once more'})
        else{

           const newRating = new Rating({
            ReviewDescription:ratingDatas.description,
            ReviewRating: ratingDatas.rating,
            propertyId : ratingDatas.propertyId,
            UsersId : ratingDatas.UsersId,
           })   

           const userRatedData = await newRating.save();

           const rating = await Rating.find({ propertyId: ratingDatas.propertyId })
           if(rating){
            let count = 0;
            let sum = 0;
                
            rating.map((e) => {
             sum = sum + e.ReviewRating;
              count++;
            });
            
            const averageRating = Math.floor(sum / count);
            const propUpdate = await Property.findOneAndUpdate({_id:ratingDatas.propertyId}, {$set:{avgRating:averageRating}})

           }
            
           if(userRatedData ) {
            return res.status(200).json({message:'successfully updated your Review',})

           }else{ return res.status(400).json({message:'Something error occured please rate once more'})
        }
        }
        
    } catch (error) {
      console.log(error);
    }
}

const fetchAllAvailableTimes = async(req, res) => {
    try {
        const { date , slot, openingTime, closingTime, propId} = req.body
        const slotAvailabilityChecking = await Booking.find( { date: date  })
         let availableTimes = []
         let count;
         let startingTime = moment(openingTime, 'hh:mm A');
         let endingTime = moment(closingTime, 'hh:mm A');
         let parsedDate = moment(date, 'DD-MM-YYYY'); 
         let currentDate = moment();
         
         if (parsedDate.isSame(currentDate, 'day')) {
            let currentTime = moment().tz('Asia/Kolkata');
            if (startingTime.isSameOrAfter(currentTime, 'hour') && startingTime.isSameOrAfter(currentTime, 'minute')) {
                for(let i = startingTime; i < endingTime;){
                    count = 0;
                    slotAvailabilityChecking.map((e) => {
                        let time2 = moment(e.time, 'hh:mm A')
                        if(time2.isSame(i)){
                            count++
                        }
                    })
                    if(count < slot){
                        let formattedTime = i.format('hh:mm A')
                        availableTimes.push(formattedTime)
                    }
                    i.add(1, 'hour');
                      
                  }
                  return res.status(200).json({availableTimes})
            }else{   
                let currentTime = moment().tz('Asia/Kolkata');
                if (currentTime.minutes() > 0) {
                    currentTime.add(1, 'hour').startOf('hour');
                  }        
            for(let i = currentTime; i < endingTime;){
                count = 0;
                slotAvailabilityChecking.map((e) => {
                    let time2 = moment(e.time, 'hh:mm A')
                    if(time2.isSame(i)){
                        count++
                    }
                })
                if(count < slot){
                    let formattedTime = i.format('hh:mm A')
                    availableTimes.push(formattedTime)
                }
                i.add(1, 'hour');
                  
              }
              return res.status(200).json({availableTimes})
         }
          
        }else{
            for(let i = startingTime; i < endingTime;){
                count = 0;
                slotAvailabilityChecking.map((e) => {
                    let time2 = moment(e.time, 'hh:mm A')
                    if(time2.isSame(i)){
                        count++
                    }
                })
                if(count < slot){
                    let formattedTime = i.format('hh:mm A')
                    availableTimes.push(formattedTime)
                }
                i.add(1, 'hour');
                  
              }
              return res.status(200).json({availableTimes})
        }
        
    } catch (error) {
        console.log(error);
    }
}


const slotBooking = async(req, res) => {
    try {
              const bookingData = req.body;
              
              const propertyData = await Property.findById(bookingData.propId)


                 const slotAvailabilityChecking = await Booking.aggregate([
                   {
                     $match: {
                       propertyId: new ObjectId(bookingData.propId),
                       date: bookingData.bookDate,
                       time: bookingData.bookTime
                     }
                   },
                   {
                     $group: {
                       _id: null,
                       count: { $sum: 1 }
                     }
                   }
                 ]);


                 let isSlotAvailable = true;
                 if (slotAvailabilityChecking.length > 0) {
                   isSlotAvailable = slotAvailabilityChecking[0].count < propertyData.slot; 
                 }


         if(isSlotAvailable){
        const newSlotBooking = new Booking({
            subAdminId : bookingData.PropertyAdminId,
            propertyId : bookingData.propId,
            UsersId    : bookingData.userId,
            date       : bookingData.bookDate,
            time       : bookingData.bookTime,
            bookingService : bookingData.bookServices,
            TotalRate  : bookingData.price
        })

        const saveBookingPromise =  newSlotBooking.save()
        const userDetailsPromise = User.findById({_id:bookingData.userId})

        const [saveBooking, userDetails] = await Promise.all([saveBookingPromise, userDetailsPromise]);
        return res.status(200).json({saveBooking, propertyData, userDetails})
    }else {
        return res.status(400).json({message:'Sorry slot is not available in this time'})
    }
      
    } catch (error) {
        console.log(error);
    }
}

const payementprocedure = async(req, res) => {
    try {
        const BookedData = req.body
        const stripe = new Stripe("sk_test_51ODm4bSHaENjV1jroo3TowfdHte8VmCm5hGFP5Llc0Gxzeh5sGAOo6gFGoDjFvFmeWXNLEd0yMOfIXj9KocfnBIO005dT0lJmM")

      const totalAmount = BookedData.TotalRate * 100;
      const paymentintent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });

  
  const updateBookedData =  await Booking.updateOne(
        { _id: BookedData._id },
        { $set: { TransactionId: paymentintent.id } }
      );

      if(updateBookedData.modifiedCount > 0){
        return res.status(200).json({ message: "payment data",clientSecret: paymentintent.client_secret,})
      }  

    } catch (error) {
        console.log(error);
    }
}

const paymentSuccess = async (req, res) => {
    try {
      const isUpdate = await Booking.findOneAndUpdate(
        { _id: req.body.bookingId },
        { $set: { bookingStatus: "success" } }
      );


      res.status(200).json({ status: true, message: "update completed" });
    } catch (error) {
        console.log(error);
    }
  };

  const fetchBookedSummary = async(req, res) => {
    try {
        const { active, id } = req.params;
        const page = (active - 1) * 5;
        const totalBooking = await Booking.countDocuments({
          UsersId: id,
          bookingStatus: { $in: ["success", "cancel"] },
        });
        const bookingSummeryData = await Booking
          .find({ UsersId: id, bookingStatus: { $in: ["success", "cancel"] } })
          .sort({ Date: -1 })
          .skip(page)
          .limit(5)
          .populate("propertyId")
        const totalPages = Math.ceil(totalBooking / 5);
        return res.status(200).json({ bookingSummeryData, totalPages });
    } catch (error) {
        console.log(error);
    }
  }

  const fetchSummaryViewData = async(req, res) => {
    try {
     const { bookingId }   = req.body
     const data = await Booking.findById({_id: bookingId}).populate("propertyId").populate("UsersId")
     if(data)  return res.status(200).json({data})


    } catch (error) {
        console.log(error);
    }
  }

  
  const cancelBooking = async(req, res) => {
    try {
        const { bookingId } = req.body
        const updateStatus = await Booking.findOneAndUpdate({_id: bookingId}, {$set:{ bookingStatus: "cancel"}})

         if(updateStatus) return res.status(200).json({message:"Succesfully canceled Your Order"})
         else return res.status(400).json({message:"Something went wrong "})

    } catch (error) {
        console.log(error);
    }
  }


module.exports ={
    fetchprophome,
    fetchProperties,
    fetchUserDetails,
    updateUserDetails,
    fetchAllService,
    postRating,
    fetchAllAvailableTimes,
    slotBooking,
    payementprocedure,
    paymentSuccess,
    fetchBookedSummary,
    fetchSummaryViewData,
    cancelBooking,
}





