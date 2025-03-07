import jwt from 'jsonwebtoken'
import User from '../model/usermodels.js'

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Missing access token" });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "Access token expired" });
            } else if (jwtError instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid access token: " + jwtError.message });
            } else {
                return res.status(401).json({ message: "Invalid access token" });
            }
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Invalid access token: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};