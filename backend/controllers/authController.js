import bcrypt from 'bcryptjs';
import User from '../model/usermodels.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { name, email, username, password } = req.body;

    console.log("Request Body:", req.body);
    console.log('Extracted Name:', name);
    console.log('Extracted Email:', email);
    console.log('Extracted Username:', username);
    console.log('Extracted Password:', password);

    try {
        if (!name || !email || !password || !username) {
            console.error("Name, email, username or password is not defined");
            return res.status(400).json({ errors: [{ msg: 'Name, email, username, and password are required' }] });
        }

        let user = await User.findOne({ email });
        if (user) {
            console.log("User with this email already exists");
            return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
        }
        user = await User.findOne({ username });
        if (user) {
            console.log("User with this username already exists");
            return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
        }

        user = new User({
            name,
            email,
            password,
            username,
        });

        await user.save();

        console.log("User registered successfully:", user);

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error("Error signing token:", err.message);
                    return res.status(500).json({ errors: [{ msg: 'Token signing error' }] });
                }
                res.json({ token });
            }
        );

    } catch (err) {
        if (err.code === 11000) {
            console.error("Duplicate key error:", err.message);
            if (err.keyPattern && err.keyPattern.email) {
                return res.status(400).json({ errors: [{ msg: 'Email already registered' }] });
            } else if (err.keyPattern && err.keyPattern.username){
                return res.status(400).json({errors: [{msg: "Username already registered"}]});
            }
        }
        console.error("Server error:", err.message);
        console.error("Error Stack Trace:", err.stack);
        res.status(500).send('Server error');
    }
};



export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log("Email:", email); // Log the email
    console.log("Password:", password); // Log the password
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.error("User not found");
            return res.status(400).json({ msg: 'User Not Found' });
        }

        console.log("User found:", user); // Log the user details
        console.log("Stored Hashed Password:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isMatch);

        if (!isMatch) {
            console.error("Password does not match");
            return res.status(400).json({ msg: 'Password does not match' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error("Error signing token:", err.message);
                    return res.status(500).json({ errors: [{ msg: 'Token signing error' }] });
                }
                res.json({ token , user });
            }
        );

    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).send('Server error');
    }
};

export const logOut = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged Out"));
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
