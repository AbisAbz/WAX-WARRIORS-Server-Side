const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    propertyId:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'property',
        required : true,
    },
    ReviewRating: {
        type: Number,
        required: true,
    },
    ReviewDescription: {
        type: String,
        required: true,
    },
    Users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    
})