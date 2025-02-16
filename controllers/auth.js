const bcrypt = require('bcryptjs');
const models = require('../models');
const jwt = require('jsonwebtoken');
const Validator = require("fastest-validator");
const nodemailer = require('nodemailer');
const { logger } = require('sequelize/lib/utils/logger');
const v = new Validator();

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER, // SMTP host from config
        port: parseInt(process.env.SMT_PORT, 10) || 587, // Port from config or default to 587
        secure: false, // Use TLS (set true for 465)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        logger: true
    });
    const verificationLink = `${process.env.FRONTEND_URL}/verifyEmail?token=${token}`;

    const mailOptions = {
        from: process.env.MAIL_ID,
        to: email,
        subject: 'Email Verification',
        html: `<p>Click the link below to verify your email address:</p><a href="${verificationLink}">${verificationLink}</a>`
    };

    await transporter.sendMail(mailOptions);
};

const signUp = async (req, res) => {
    try {
        const { fullName, email, phoneNo, profile, password, country } = req.body;

        // Check if the user already exists
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(200).json({ status: 409, message: 'Email is already registered' });
        }

        // Validate user input
        const user = { fullName, email, phoneNo, profile, password, country };
        const schema = {
            fullName: { type: "string", min: 5 },
            email: { type: "string", min: 10 },
            phoneNo: { type: "string", min: 9, optional: true },
            profile: { type: "string", optional: true },
            password: { type: "string", min: 8 },
            country: { type: "string", optional: true },
            kyc: { type: "string", optional: true, default: false },
            blocked: { type: "boolean", optional: true, default: false },
            subscribedPlan: { type: "string", optional: true, default: "free" },
            balance: { type: "number", optional: true, default: 0 },
            emailVerified: { type: "boolean", optional: true, default: false },
            miningLevel: { type: "number", optional: true, default: 1 },
        };

        const validationResponse = v.validate(user, schema);
        if (validationResponse !== true) {
            return res.status(200).json({ status: 400, message: "Validation failed", errors: validationResponse });
        }
        user.password = await bcrypt.hash(password, 12);
        user.emailVerified = false;
        // Create the new user with "verified" status set to false initially
        const newUser = await models.User.create({ ...user });

        // Create a verification token
        const verificationToken = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send the verification email
        // await sendVerificationEmail(newUser.email, verificationToken);

        res.status(200).json({ status: 201, message: "User signed up successfully. Please check your email for verification.", data: newUser });
    } catch (error) {
        console.error("Sign-up error:", error);
        res.status(200).json({ status: 500, message: "An error occurred during sign-up", error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send(`
                <html>
                    <head>
                        <style>
                            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; text-align: center; }
                            .container { max-width: 400px; }
                            h2 { color: red; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Token is missing</h2>
                            <img src="https://cdn-icons-png.flaticon.com/512/463/463612.png" width="150"/>
                        </div>
                    </body>
                </html>
            `);
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user
        const user = await models.User.findOne({ where: { id: decoded.userId, email: decoded.email } });

        if (!user) {
            return res.status(404).send(`
                <html>
                    <head>
                        <style>
                            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; text-align: center; }
                            .container { max-width: 400px; }
                            h2 { color: red; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>User not found</h2>
                            <img src="https://cdn-icons-png.flaticon.com/512/463/463612.png" width="150"/>
                        </div>
                    </body>
                </html>
            `);
        }

        // Check if the user is already verified
        if (user.emailVerified === true) {
            return res.status(200).send(`
                <html>
                    <head>
                        <style>
                            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; text-align: center; }
                            .container { max-width: 400px; }
                            h2 { color: blue; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Email Already Verified</h2>
                            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" width="150"/>
                        </div>
                    </body>
                </html>
            `);
        }

        // Mark the user as verified
        user.emailVerified = true;
        await user.save();

        return res.status(200).send(`
            <html>
                <head>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; text-align: center; }
                        .container { max-width: 400px; }
                        h2 { color: green; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Email Verified Successfully</h2>
                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" width="150"/>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).send(`
            <html>
                <head>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; text-align: center; }
                        .container { max-width: 400px; }
                        h2 { color: red; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>An error occurred during email verification</h2>
                        <p>${error.message}</p>
                        <img src="https://cdn-icons-png.flaticon.com/512/463/463612.png" width="150"/>
                    </div>
                </body>
            </html>
        `);
    }
};


const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user input
        const schema = {
            email: { type: "string" },
            password: { type: "string", min: 8 },
        };
        const validationResponse = v.validate({ email, password }, schema);
        if (validationResponse !== true) {
            return res.status(200).json({ status: 400, message: "Validation failed", errors: validationResponse });
        }

        // Check if the user exists
        const user = await models.User.findOne({
            where: { email }
        });
        if (!user) {
            return res.status(200).json({ status: 404, message: 'No user registered with this email' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(200).json({ status: 401, message: "Incorrect password" });
        }
        console.log('JWT Secret:', process.env.JWT_SECRET);
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.status(200).json({
            status: 200,
            message: "Signed in successfully",
            data: {
                ...user.toJSON(),
                expiresIn: "7d",
                token: token
            }
        });
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(200).json({ status: 500, message: "An error occurred during sign-in", error: error.message });
    }
};

const delUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find and delete the user by ID
        const deletionResult = await models.User.destroy({ where: { id: userId } });

        if (deletionResult) {
            return res.status(200).json({ status: 200, message: 'Account deleted successfully' });
        } else {
            return res.status(200).json({ status: 404, message: 'Account not found' });
        }
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(200).json({ status: 500, message: 'An error occurred while deleting the account', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { id, fullName, email, phoneNo, profile, password, country, kyc, blocked, subscribedPlan, balance, miningLevel } = req.body;

        // Find the user by ID
        const user = await models.User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        // Validate the updated input
        const updatedData = { fullName, email, phoneNo, profile, password, country, kyc, blocked, subscribedPlan, balance, miningLevel };
        const schema = {
            fullName: { type: "string", min: 5, optional: true },
            // email: { type: "email", optional: true },
            phoneNo: { type: "string", optional: true },
            profile: { type: "string", optional: true },
            password: { type: "string", min: 8, optional: true },
            country: { type: "string", optional: true },
            kyc: { type: "string", optional: true },
            blocked: { type: "boolean", optional: true },
            subscribedPlan: { type: "string", optional: true },
            balance: { type: "number", integer: true, optional: true },
            emailVerified: { type: "boolean", optional: true },
            miningLevel: { type: "number", integer: true, optional: true },
        };

        const validationResponse = v.validate(updatedData, schema);
        if (validationResponse !== true) {
            return res.status(400).json({ status: 400, message: "Validation failed", errors: validationResponse });
        }

        // If a password is provided, hash it
        if (password) {
            updatedData.password = await bcrypt.hash(password, 12);
        }

        // Update the user with the new data
        await user.update(updatedData);

        res.status(200).json({ status: 200, message: "Profile updated successfully", data: user });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ status: 500, message: 'An error occurred while updating the profile', error: error.message });
    }
};

module.exports = {
    signUp,
    signIn,
    delUser,
    verifyEmail,
    updateProfile,
};