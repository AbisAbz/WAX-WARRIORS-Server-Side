const User  =  require('../Models/UserModel');
const Property = require('../Models/PropertyModel')
const sendEmail = require('../Utils/NodeMailer')



const userList = async (req, res) => {
    try {
      const usersResponse = await User.find({ verified: true });
  
      if (usersResponse && usersResponse.length > 0) {
        return res.status(200).json({ users: usersResponse });
      } else {
        return res.status(400).json({ message: 'No users found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  const userblock = async (req, res) => {
    try {
       const  { id }   = req.body
       const data = await User.findOne({_id:id})
       
       const response  = await User.updateOne({ _id: data._id}, {$set:{ is_block: !data.is_block}})

       if(response.modifiedCount !== 1) return res.status(400).json({message: 'Something went wrong please try again'});
           
       return res.status(200).json({message:'Successfully Updated'})

       
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' }); 
      
    }
  }


  const fetchProperty = async(req, res) => {
     try {
        const { message } = req.body
        const response = await Property.find({status: message})
        if(!response) return res.status(400).json({message:'No properties added'});
        else return res.status(200).json({response})
     } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' }); 
     }
  }

  const propertyAprove = async(req, res) => {
     try {
       const id = req.body.id
       const response = await Property.updateOne({_id:id},{$set:{status:'approved'}})
       console.log("iam the respnse of the udating property", response);
         return res.status(200).json({message:'successfully updated'})
  
     } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' }); 
     }
  }

const rejectMail = async(req, res) => {
  try {
  const { id, rejectionReason } = req.body
  const response = await Property.findByIdAndUpdate({_id:id},{$set:{status:'Reject'}}).populate("subAdminId")
  const email = response.subAdminId.email
  const subject = rejectionReason
  const sendRejMAil = await sendEmail(email, subject)
   if(!sendRejMAil) return res.status(400).json({message:'Something error occured'});
   else return res.status(200).json({message:'Successfully Rejected'})
  
   
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' }); 
  }
}





module.exports = {
    userList,
    userblock,
    fetchProperty,
    propertyAprove,
    rejectMail,
}