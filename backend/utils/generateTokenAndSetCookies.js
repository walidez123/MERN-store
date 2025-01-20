import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export const generateTokenAndSetCookies = async(res , userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "7d"
    })
    res.cookie("token" , token ,{
        httpOnly: true,
        secure:process.env.NODE_ENV === "production",
        maxAge: 7*60*60*1000
    })
    return token
}