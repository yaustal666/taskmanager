import express from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { validate_async } from 'email-validator'
import { authenticate } from './middlewares.js'

const router = express.Router();

router.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email and password must be provided' });
    }

    if (!validate_async(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.lenght < 4) {
        return res.status(400).json({ error: 'Password must contain at least 4 characters' });
    }

    try {
        // TODO - add needed query to database
        const userName = await getUserByUsername.get(username);
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // TODO - add needed query to database
        const userEmail = await getUserByEmail.get(email);
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const passwordHash = await argon2.hash(password);

        // TODO - add needed query to database
        await addUser.run(username, email, hash);

        const token = jwt.sign(
            {
                user: username,
                email: email
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            message: 'User created successfully',
            token
        });

    } catch (error) {
        console.error('ERROR during REGISTRATION process:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password must be provided' });
    }

    if (!validate_async(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

 try {
        // TODO - add needed query to database
        const user = await getUserByEmail.get(email);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordCorrect = await argon2.verify(user.password_hash, password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                user: user.username,
                email: user.email,
                userId: user.id
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;

