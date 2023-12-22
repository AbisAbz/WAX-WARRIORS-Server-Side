const Admin  = require('../../Models/UserModel')
const jwt    = require('jsonwebtoken')
const bcrypt = require('bcrypt') 



const adminLogin = async(req, res) => {
    try {
        
       const {email, password} = req.body;
       const existEmail = await Admin.findOne({email: email})

       if(existEmail){
        if(existEmail.is_admin === 1){
           const truePass = await bcrypt.compare(password, existEmail.password)

           if(truePass){
              const adminToken = jwt.sign(
                {id:existEmail._id},
                process.env.SECRET_KEY,
                {expiresIn: '1h'}
              )

              return res.status(200).json({existEmail, adminToken})
            }else return res.status(400).json({message:'Your password is incorrect'});
          }else return res.status(400).json({message:'No permission to access'});
       }else  return res.status(400).json({message:'Email is incorrect'});
       
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports ={
    adminLogin,
}