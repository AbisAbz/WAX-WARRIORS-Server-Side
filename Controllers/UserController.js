const jwt      = require('jsonwebtoken')
const User     = require('../Models/UserModel')
const Property = require('../Models/PropertyModel')


const fetchProperties = async(req, res) => {
    try {
     const data = await Property.find()
     console.log("iam the data of the fetch property ", data);
     if(data) return res.status(200).json({data})
     else return res.status(400).json({message:'No Properties found'})
    } catch (error) {
        console.log(error); 
    }
}

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
        console.log("iamin the back end of updateUserDetails", req.body.values);
        const userDatas = req.body.values
        const _id = await User.findById(req.body.id)
        
        const updateUser = await User.updateOne({_id:_id}, {$set:{name:userDatas.name, mobile:userDatas.mobile, district:userDatas.district, 
                                                            houseName:userDatas.houseName, state:userDatas.state, email:userDatas.email}})
           
            if(updateUser.modifiedCount > 0) return res.status(200).json({message:'Successfuly updated'})
            else{
              return res.status(400).json({message:'Something went occur please update Once again'})
            }
        
    } catch (error) {
        console.log(error);
    }
}


module.exports ={
    fetchProperties,
    fetchUserDetails,
    updateUserDetails,
}





