const jwt = require('jsonwebtoken')
const Admin = require('../Models/UserModel')
const User = require('../Models/UserModel')


//=================Admin Authantication============//

const AdminAuth = async (req, res, next) => {
   try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
         return res.status(401).json({ message: "Token not provided" });
      }

      jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
         if (err) {
            console.log("hahahah");
            return res.status(401).json({ message: "Token expired or invalid" });
         }

         const adminId = decodedToken.id;
         const existId = await Admin.findById(adminId);
         if (!existId) {
            return res.status(400).json({ message: 'You are not Authorized' });
         }

         req.body.adminId = existId._id;
         next();
      });
   } catch (error) {
      console.error("Error in AdminAuth middleware:", error);
      return res.status(500).json({ message: 'Internal server error' });
   }
};


//=================User Authantication============//

const UserAuth = async (req, res, next) => {
   try {
      const token = req.headers.authorization?.split(" ")[1]
      if (token) {
         const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
         const UserId = decodeToken.userId;
         const existId = await User.findById({_id:UserId})

         if (!existId) {
            return res.status(400).json({ message: 'You are not Autharized' });

         }else if (existId.is_block === true) {
               return res.status(403).json({ message: 'You are blocked by admin' });
            } else {
               req.body.UserId = existId._id;
               next();
            }
      } else{
          return res.status(400).json({ message: 'You are not Autharized' });
      }
   } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
   }
}

module.exports = {
   AdminAuth,
   UserAuth,
}

