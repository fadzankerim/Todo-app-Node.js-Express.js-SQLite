
import jwt from 'jsonwebtoken';

function authMiddlewatre(req,res,next){
    const token = req.headers['authorization'];    

    if(!token){return res.status(401).json( { message: "No token provided"})};

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){return res.status(401).json({message: "Invalid token"})};

        req.userid = decoded.id
        next()
    })
}

export default authMiddlewatre