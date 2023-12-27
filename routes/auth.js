const router  = require("express").Router();
const User = require('../model/User');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
//Register end point
router.post("/register", async (req,res)=>{
    //  validate data
    const result = registerValidation(req.body);
    const { value, error } = result; 
    const valid = error == null; 
    if (!valid)
    {
        return res.status(422).json({ 
            message: result.error.details[0].message, 
            data: value
          })
    }
    else
    {
        // checking duplicate in formation
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist)return res.status(422).json({ message: "email is already exist"});
        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(req.body.password, salt);
        //
        const user = new User(
            {
            name:       req.body.name,
            email:      req.body.email,
            password:   hashPassword,
            role:       'user'
            }
        );
        //
        try {
            const savedUser = await user.save();
            return res.status(201).json({ 
                message: 'User created', 
                user_id: savedUser._id
              });
        } catch (error) {
            return res.status(400).json({ 
                message: 'error while creation', 
                error: error
              });
        }
    }
});
//Log in end point
router.post("/Login", async (req,res)=>{
    //  validate data
    const result = loginValidation(req.body);
    const { value, error } = result; 
    const valid = error == null; 
    if (!valid)
    {
        return res.status(422).json({ 
            message: result.error.details[0].message, 
            data: value
          });
    }
    else
    {
        // checking if email dose'nt exist
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({ message: "email not found"});
        // password if correct 
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword) return res.status(400).json({ message: "invalid password"});

        // cerate and assign a token
        const token = jwt.sign({    user_id: user._id, 
                                    user_role: user.role},
                                    process.env.ACCESS_TOKEN_SECRET, 
                                    {expiresIn:'1h'}
                                );
        return res.status(200).json({ 
            message: 'success', 
            user_id: user._id,
            token: token
          });
        
    }
});
//Log out end point
router.post("/Logout", async (req,res)=>{
    //  validate data
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];
});


module.exports = router;

