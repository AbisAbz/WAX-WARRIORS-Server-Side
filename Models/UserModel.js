const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    houseName:{
        type:String,
        required:false
    },
    state:{
       type:String,
       required:false
    },
    district:{
         type:String,
         required:false
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
    
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

module.exports = mongoose.model('User',userschema)

