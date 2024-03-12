const mongoose = require('mongoose')

const slotBookingSchema = new mongoose.Schema({
    subAdminId:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'SubAdmin',
        required : true,
    },
    propertyId:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'property',
        required : true,
    },
    TransactionId:{
      type: String,
    },
    UsersId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      paymentMethode:{
        type: String,
        default: 'online'
      },
      bookingStatus: {
        type: String,
        default: "pending",
      },
      date:{
        type : String,
        required : true,
      },
      time:{
        type : String,
        required : true,
      },
      bookingService:{
        type :String,
        required : true,
      },
      TotalRate: {
        type: Number,
      },
})

module.exports = mongoose.model('booking', slotBookingSchema)