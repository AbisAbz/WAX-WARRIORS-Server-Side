const mongoose = require('mongoose')

const subAdminschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
    
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        default:0
    },
    verified: {
        type: Boolean,
        default: false,
    },
    is_block:{
        type:Boolean,
        default:false
    },
    is_google:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('SubAdmin',subAdminschema)

