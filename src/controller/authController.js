const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (name, email, password, phone)
             VALUES ($1, $2, $3, $4) 
             RETURNING id, name, email, phone, created_at`,
            [name, email, hashedPassword, phone]
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

            const token = jwt.sign(
            {
                id: user.rows[0].id,
                email: user.rows[0].email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

module.exports = {
    registerUser,
    loginUser
}