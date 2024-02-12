const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    propertyId:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'property',
        required : true,
    },
    serviceName:{ 
    type :  String,
    required: true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
})

module.exports = mongoose.model('Service', serviceSchema);
