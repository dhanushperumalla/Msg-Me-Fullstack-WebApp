//import { TokenExpiredError } from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import genrateTokenAndSetCookie from "../utils/genrateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password dont match" })
        }

        const user = await User.findOne({ userName })

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // hash pass here

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //https://avatar-placeholder.iran.liara.run/

        const boyprofilePic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${userName}`
        const girlprofilePic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User({
            fullName,
            userName,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyprofilePic : girlprofilePic
        })



        if (newUser) {
            //Genrate JWT token Hear
            genrateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilePic: newUser.profilePic
            });

        } else {
            res.status(400).json({ error: "Invalid User Data" })
        }


    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.userName === 1) {
            // Duplicate key error for the 'userName' field
            return res.status(400).json({ error: "Username already exists" });
        }

        console.log("Error in signup controller", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }


}

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        genrateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic
        })

    } catch (err) {
        console.log("Error in login controller", err)
        res.status(500).json({ err: "internall server error" })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Sucessfully" })
    } catch (err) {
        console.log("Error in logout controller", err)
        res.status(500).json({ err: "internall server error" })
    }
}
