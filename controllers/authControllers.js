import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

import { users } from '../models/userModel.js'
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"

// User signup
export const signup = async (req, res) => {

    /**
    POST: /api/v1/auth/signup
    {
        "firstName": "Milan",
        "lastName": "Sony",
        "email": "milan@gmail.com",
        "password": "1234567890"
    }
    */

    try {
        const { firstName, lastName, email, password } = req.body

        // Check empty input fields
        if (!firstName) {
            return res.status(400).json({
                status: 400,
                message: "First Name is required"
            })
        }

        if (!email) {
            return res.status(400).json({
                status: 400,
                message: "Email is required"
            })
        }

        if (!password) {
            return res.status(400).json({
                status: 400,
                message: "Password is required"
            })
        }

        // Check if the user already exists or not
        const existingUser = await users.findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "User with this email already exists!"
            })
        }

        // Hashing/salting the password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // Creating the new user object
        const newUser = new users({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            // Save new user to DB
            await newUser.save()
            return res.status(201).json({
                status: 201,
                message: "Account successfully created",
                data: newUser
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Something went wrong, account not created"
            })
        }

    } catch (error) {
        console.error("Error signing up the user, ", error)
        return res.status(500).json({
            status: 500,
            message: "Error signing up the user",
            error: error.message
        })
    }
}

// User login
export const login = async (req, res) => {

    /**
    POST: /api/v1/auth/login
    {
        "email": "milan@gmail.com",
        "password": "1234567890"
    }
    */

    try {
        const { email, password } = req.body

        // Check user exists
        const user = await users.findOne({ email: email })

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid credentials"
            })
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                status: 400,
                message: "Invalid credentials"
            })
        }

        const accessToken = generateAccessToken(user._id)
        generateRefreshToken(user._id, res)

        const userData = {
            userId: user._id,
        }

        return res.status(200).json({
            status: 200,
            message: "You have successfully logged in",
            data: userData,
            token: accessToken
        })

    } catch (error) {
        console.error("Error logging in the user, ", error)
        return res.status(500).json({
            status: 500,
            message: "Error logging in the user",
            error: error.message
        })
    }
}

// Generate refresh token when access token expires
export const refresh = (req, res) => {

    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'Refresh token not found'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN)

        const userId = decoded.userId

        const newAccessToken = generateAccessToken(userId)

        return res.status(200).json({
            status: 200,
            message: "New access token generated",
            accessToken: newAccessToken
        })
    } catch (error) {
        console.error("Refresh token error:", error)

        return res.status(403).json({
            status: 403,
            message: 'Invalid or expired refresh token',
            error: error.message
        })
    }
}

// User logout
export const logout = (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
        })
        return res.status(200).json({
            status: 200,
            message: "You have successfully logged out"
        })
    } catch (error) {
        console.error("Error logging out the user, ", error)
        return res.status(500).json({
            status: 500,
            message: "Error logging out the user",
            error: error.message
        })
    }
}