import jwt from "jsonwebtoken";
function authMiddleware(req,res,next) {
    const header = req.headers.authorization;
    if(!header) {
        return res.status(401).json({message:"Token required"});
    }
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token,process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
}

function adminMiddleware(req,res,next) {
    if(req.user.userRole !== "admin") {
        return res.status(403).json({message: "Admin access required"})
    }
    next();
}



export {authMiddleware,adminMiddleware};