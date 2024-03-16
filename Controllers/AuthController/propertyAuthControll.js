const SubAdmin = require('../../Models/SubAdminModel')
const TokenModel = require('../../Models/SubAdminToken')
const sendEmail = require('../../Utils/NodeMailer')
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { SecurePassword } = require('../../Utils/SecurePassword')


const PropertyRegistration = async (req, res, next) => {
    try {
      const userDetails = req.body;
      const hashedPassword = SecurePassword(userDetails.password)
      const existEmail = SubAdmin.findOne({ email: userDetails.email })
  
      const [exist, hashPassword] = await Promise.all([existEmail, hashedPassword])
  
      if (exist) {
        return res.status(400).json({ message: 'Email already exist' });
      } else {
        const newSubAdmin = new SubAdmin({
          name: userDetails.name,
          email: userDetails.email,
          mobile: userDetails.mobile,
          password: hashPassword,
        })
  
        const subAdminData = await newSubAdmin.save();
        if (subAdminData) {
  
          const id = subAdminData._id;
          const token = await new TokenModel({
            subAdminId: id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save()
  
  
          const url = `http://localhost:5173/property/${subAdminData._id}/${token.token}`;
  
          sendEmail(subAdminData.email, "Verify Your Email", url)
  
          return res.status(200).json({ message: 'An email send to your account verify' })
  
        }
        else res.status(400).json({ message: '"registration failed"' })
      }
  
    } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  
  }

  const verifyPropertyOwner = async (req, res, next) => {
    try {
      const verifyEmail = await SubAdmin.findOne({ _id: req.params.id });
      const TokenVerify = await TokenModel.findOne({ token: req.params.token, subAdminId: req.params.id });

      if (!verifyEmail) {
        return res.status(400).json({ message: 'Link is invalid' });
      } else if (!TokenVerify) {
        return res.status(400).json({ message: 'Verification link may be expired' });
      } else {
        const updateUser = await SubAdmin.updateOne({ _id: verifyEmail._id }, { $set: { verified: true } });
  
  
        if (updateUser.modifiedCount > 0) {
          const propOwnerData = await SubAdmin.findOne({ _id: verifyEmail._id });
          const result = await TokenModel.deleteOne({ subAdminId: userData._id });

  
          const subAdminToken = jwt.sign(
            { userId: userData._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
          );
         

  
  
          if (result.deletedCount > 0) {
            return res.status(200).json({ subAdminToken, propOwnerData, message: 'Successfully Registered your Account' });
          } else {
            return res.status(400).json({ message: 'Internal Server Error' });
          }
        } else {
          return res.status(400).json({ message: 'Internal Server Error' });
        }
      }
    } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



  const propLogin = async(req,res, next) => {
    try {
      const {email, password} = req.body;
       const exist = await SubAdmin.findOne({email:email})
       if (exist) {

        const truePass = await bcrypt.compare(password,exist.password)
       
  
        if (truePass) {
           
          const subAdminToken = jwt.sign(
            { userId: exist._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
            )
            
          return res.status(200).json({ subAdminToken, exist })
        } else {
  
          return res.status(400).json({ message: 'Your password is incorrect' })
        }
      } else {
        return res.status(400).json({ message: 'Your email is incorrect' })
      }
  
    } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    } 



  module.exports ={
    PropertyRegistration,
    verifyPropertyOwner,
    propLogin,
  }
