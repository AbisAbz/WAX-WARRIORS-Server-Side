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
        required:true,
    },
    images: {
        type: Array,
      },

})

module.exports = mongoose.model('property', propertySchema)