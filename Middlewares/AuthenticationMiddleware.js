const jwt = require('jsonwebtoken')
const Admin = require('../Models/UserModel')
const User = require('../Models/UserModel')


//=================Admin Authantication============//

const AdminAuth = async (req, res, next) => {
   try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
         const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
         const adminId = decodeToken.id
         const existId = await Admin.findById(adminId)
         if (existId) {
            req.body.adminId = existId._id
            next();
         } else return res.status(400).json({ message: 'You are not Autharized' });

      } else return res.status(400).json({ message: 'You are not Autharized' });
   } catch (error) {
      console.log("iam the error from the adminAuth ", error);
      return res.status(500).json({ message: 'Internal server error' });

   }
}

//=================User Authantication============//

const UserAuth = async (req, res, next) => {
   try {
      const token = req.headers.authorization?.split(" ")[1]
      console.log("iam the token of the user ", token);
      if (token) {
         const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
         console.log("iam the decode token and verifing the secret code ", decodeToken);
         const UserId = decodeToken._id;
         const existId = await User.findById(UserId)

         if (!existId) return res.status(400).json({ message: 'You are not Autharized' });
         else if (existId.is_block === true) return res.status(403).json({ message: 'You are blocked by admin' });
         else {
            req.body.UserId = existId._id;
            next();
         }

      } else return res.status(400).json({ message: 'You are not Autharized' });
   } catch (error) {
      console.log("iam the error from the adminAuth ", error);
      return res.status(500).json({ message: 'Internal server error' });
   }
}

module.exports = {
   AdminAuth,
   UserAuth,
}

