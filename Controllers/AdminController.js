const User  =  require('../Models/UserModel');
const Property = require('../Models/PropertyModel')
const SubAdmin = require('../Models/SubAdminModel')
const sendEmail = require('../Utils/NodeMailer')



const userList = async (req, res, next) => {
    try {
      const usersResponse = await User.find({ verified: true });
  
      if (usersResponse && usersResponse.length > 0) {
        return res.status(200).json({ users: usersResponse });
      } else {
        return res.status(400).json({ message: 'No users found' });
      }
    } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  const userblock = async (req, res, next) => {
    try {
       const  { id }   = req.body
       const data = await User.findOne({_id:id})
       
       const response  = await User.updateOne({ _id: data._id}, {$set:{ is_block: !data.is_block}})

       if(response.modifiedCount !== 1) return res.status(400).json({message: 'Something went wrong please try again'});
           
       return res.status(200).json({message:'Successfully Updated'})

       
      
    } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" });
      
    }
  }


  const fetchProperty = async(req, res, next) => {
     try {
        const propData = await Property.find()

        if(!propData) {
        return res.status(400).json({message:'No properties added'});
         } else {
           let filtredPropData = []
            propData.map((e) => {
           if(e.status === "Pending"){
            filtredPropData.push(e)
           }
           })
           propData.map((e) => {
             if(e.status !== "Pending"){
              filtredPropData.push(e)
             }
           })
            
          return res.status(200).json({filtredPropData})
         }
     } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" }); 
     }
  }

  const propertyAprove = async(req, res, next) => {
     try {
       const id = req.body.id
       const response = await Property.updateOne({_id:id},{$set:{status:'approved'}})
         return res.status(200).json({message:'successfully updated'})
  
     } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" });
     }
  }

const rejectMail = async(req, res, next) => {
  try {
  const { id, rejectionReason } = req.body
  const response = await Property.findByIdAndUpdate({_id:id},{$set:{status:'Rejected'}}).populate("subAdminId")
  const email = response.subAdminId.email
  const subject = rejectionReason
  const sendRejMAil = await sendEmail(email, subject)
   if(!sendRejMAil) return res.status(400).json({message:'Something error occured'});
   else return res.status(200).json({message:'Successfully Rejected'})
  
   
  } catch (error) {
    next(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const fetchDash = async(req, res, next) => {
  try {
     const userDataPromise =  User.find() 
     const propDataPromise = Property.find()
     const propOwnersPromise = SubAdmin.find()

     const [userData, propData, propOwners] = await Promise.all([userDataPromise, propDataPromise, propOwnersPromise])
     return res.status(200).json({userData:userData.length, propData:propData.length, propOwners:propOwners.length})
    
  } catch (error) {
    next(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}





module.exports = {
    userList,
    userblock,
    fetchProperty,
    propertyAprove,
    rejectMail,
    fetchDash,
}