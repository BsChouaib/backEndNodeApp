const jwt = require('jsonwebtoken');
// middle ware to verify our token
const check_security = ((req,res,next)=>{
    const authHeaders = req.headers['authorization'];
    // res.send(authHeaders);
    // return;
    const token = authHeaders && authHeaders.split(' ')[1];
    if(!token) return res.status(401).json({ message: "Access Denied"});

    try 
    {
        const verified = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user       = verified;
        next();
    } 
    catch (error) 
    {
        return res.status(403).json({ message: "Invalid Token"});
    }


});
const isAdmin = ((req, res, next) => {
    if (req.user && req.user.user_role.includes('admin')) {
        next();
    } else {
        return res.status(403).json({ message: 'Accès refusé. Vous devez être administrateur.'});
    }
});
const getUserid=((reqAuth)=>{
    const authHeaders = reqAuth;
    const token = authHeaders && authHeaders.split(' ')[1];
    if(!token) return res.status(401).json({ message: "Access Denied"});
    try
    {
        const decodedToken = jwt.decode(token);
        const user_id = decodedToken.user_id;
        return user_id;
    }
    catch(error)
    {
        return res.status(400).json({ message: "User id not exist"});
    }
    
})
module.exports.check_security = check_security;
module.exports.isAdmin = isAdmin;
module.exports.getUserid = getUserid;