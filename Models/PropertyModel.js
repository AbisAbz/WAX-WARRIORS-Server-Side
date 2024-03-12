const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    subAdminId:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'SubAdmin',
        required : true,
    },
    propertyName : {
        type : String,
        required : true,
    },
    slot:{
        type : Number,
        required : true,
    },
    country:{
        type : String,
        required : true,
    },
    state:{
        type:String,
        required:true,
    },
    district:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    openingTime:{
        type:String,
        required:true,
    },
    closingTime:{
        type:String,
        required:true,
    },
    avgRating:{
        type:Number,
        default: 0,
    },
    mobile:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
    },
    images: {
        type: Array,
      },
    is_visible:{
        type:Boolean,
        default: true,
    }

})

module.exports = mongoose.model('property', propertySchema)