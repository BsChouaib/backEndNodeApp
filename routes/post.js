const router  = require("express").Router();
const {check_security,isAdmin}  = require('./verifyToken');

router.get('/', check_security,(req,res)=>{
    return res.status(200).json({ title: 'game of thrones',description:'série'});
})


module.exports = router;