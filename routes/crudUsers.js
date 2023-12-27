const router  = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const {check_security, isAdmin}  = require('./verifyToken');
const {creationValidation} = require('../validation');
// create user
router.post('/users', check_security, isAdmin, async (req, res) => {
    // validation
    const result = creationValidation(req.body);
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
            role:       req.body.role
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

// get all users
router.get('/users', check_security, isAdmin, async (req, res) => {
    try {
        const users = await User.find({},{_id:1,name:1,email:1,role:1});
        return res.status(200).json({ 
            message: 'success', 
            data: users
          })
    } catch (error) {
        return res.status(422).json({ 
            message: 'error', 
            error : error,
            data: []
          })
    }
});

// get user by id
router.get('/users/:id',check_security, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                message: `User id: ${req.params.id} is not found`,
              })
        }
        return res.status(200).json({ 
            message: 'success',
            data: user
          })
    } catch (error) {
        return res.status(500).json({ 
            message: 'error', 
            error: error
          })
    }
});

// update user
router.patch('/users',check_security, async (req, res) => {
    const updates = Object.keys(req.body);
    
    const allowedUpdates = ['id','name', 'email', 'password']; // Ajoutez d'autres champs autorisés au besoin
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
        return res.status(400).json({ 
            message: 'Invalid updates!',
          })
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(req.body.password, salt);
        //
        const newValues = { name: req.body.name, email: req.body.email, password: hashPassword };
        const user = await User.findByIdAndUpdate(req.body.id, newValues);
        // 
        if (!user) {
            return res.status(404).send();
        }
        return res.status(200).json({ 
            message: 'User updated successfully',
          })
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete user
router.delete('/users/:id', check_security, isAdmin,async (req, res) => {
    // return res.send(req.body);
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        // return res.send(user);
        if (!user) {
            return res.status(404).json({ 
                message: `User id: ${req.params.id} is not found`,
              })
        }
        return res.status(200).json({ 
            message: 'User deleted successfully',
          })
    } catch (error) {
        return res.status(500).json({ 
            message: 'error', 
            error: error
          })
    }
});

module.exports = router;
