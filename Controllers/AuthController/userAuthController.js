const crypto = require('crypto');
const sendEmail = require('../../Utils/NodeMailer');
const TokenModel = require('../../Models/TokenModel');
const User = require('../../Models/UserModel');
const { SecurePassword } = require('../../Utils/SecurePassword');
const jwt = require('jsonwebtoken')
const bcrypt  = require('bcrypt')


const userRegistration = async (req, res) => {

  try {
    const userDetails = req.body;
    const hashedPassword = SecurePassword(userDetails.password)
    const existEmail = User.findOne({ email: userDetails.email })

    const [exist, hashPassword] = await Promise.all([existEmail, hashedPassword])

    if (exist) {
      return res.status(400).json({ message: 'Email already exist' });
    } else {
      const newUSer = new User({
        name: userDetails.name,
        email: userDetails.email,
        mobile: userDetails.mobile,
        password: hashPassword,
      })

      const userData = await newUSer.save();


      if (userData) {

        const id = userData._id;
        const token = await new TokenModel({
          userId: id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save()


        const url = `http://localhost:5173/${userData._id}/${token.token}`;

        sendEmail(userData.email, "Verify Your Email", url)

        return res.status(200).json({ message: 'An email send to your account verify' })

      }
      else console.log("registration failed");
    }

  } catch (error) {
    console.log(error); 
    return res.status(500).json({ message: 'Internal Server Error' });
  }

}

const verifyUser = async (req, res) => {
  try {

    const verifyEmail = await User.findOne({ _id: req.params.id });
    const TokenVerify = await TokenModel.findOne({ token: req.params.token, userId: req.params.id });


    if (!verifyEmail) {
      return res.status(400).json({ message: 'Link is invalid' });
    } else if (!TokenVerify) {
      return res.status(400).json({ message: 'Verification link may be expired' });
    } else {
      const updateUser = await User.updateOne({ _id: verifyEmail._id }, { $set: { verified: true } });


      if (updateUser.modifiedCount > 0) {
        const userData = await User.findOne({ _id: verifyEmail._id });
        const result = await TokenModel.deleteOne({ userId: userData._id });

        const userToken = jwt.sign(
          { userId: userData._id },
          process.env.SECRET_KEY,
          { expiresIn: '1h' }
        );


        if (result.deletedCount > 0) {
          return res.status(200).json({ userToken, userData, message: 'Successfully Registered your Account' });
        } else {
          console.log("Not deleted the token of the user");
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      } else {
        console.log("Not updated the verify in the user");
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const userLogin = async (req, res) => {
  try {

    const { email, password } = req.body;
    const existEmail = await User.findOne({ email: email })
    
    if (existEmail) {

      const truePass = await bcrypt.compare(password,existEmail.password)
     

      if (truePass) {
         
        const userToken = jwt.sign(
          { userId: existEmail._id },
          process.env.SECRET_KEY,
          { expiresIn: '1h' }
        )
        
        return res.status(200).json({ userToken, existEmail })
      } else {

        return res.status(400).json({ message: 'Your password is incorrect' })
      }
    } else {
      return res.status(400).json({ message: 'Your email is incorrect' })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


const googleSignUp = async(req,res) => {
  try {

      const {email, name, id} = req.body; 
      const exist = await User.findOne({email:email})
      if(exist){
        return res.status(400).json({message:'Email already exist'})
      }else{
        const newUser = new User({
          name ,
          email,
          is_google:true,
          password:id,
        })

        const userData = await newUser.save();
        console.log("iam the userData", userData);
        
        if(userData){

          const userToken = jwt.sign(
            { userId: userData._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
  
          )

          return res.status(200).json({userToken,userData,message:'Successfully Registered your Account'})
        }
         
      }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
    
  }
}

const googlelogin = async(req, res) => {
  try {
    const {email}  = req.body
    const exist = await User.findOne({email:email})
    if(exist){
      if(exist.is_google === true){

         const userToken = jwt.sign(
          {userId:exist._id},
          process.env.SECRET_KEY,
          { expiresIn: '1h' },

         )
         return res.status(200).json({userToken, exist})
      }else{
        return res.status(400).json({message:'Account not found please SignUp'})
      }
    }else{
      return res.status(400).json({message:'Account not found please SignUp'})
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports = {
  userRegistration,
  verifyUser,
  userLogin,
  googleSignUp,
  googlelogin,
};
