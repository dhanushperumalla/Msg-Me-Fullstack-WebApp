import jwt from 'jsonwebtoken'

const genrateTokenAndSetCookie = (userID,res)=>{
    const token = jwt.sign({userID},process.env.JWT_SECRET_KEY,{
        expiresIn:'15d'
    })

    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true, //prevent XSS attacks
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "devlopment"
    })
}

export default genrateTokenAndSetCookie;