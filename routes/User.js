const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

router.post('/signup', async (req, res) => {
    try {
            const userData = req.body;
            console.log(userData);
            const existingUser = await User.findOne({
                where: { 
                    [Op.or]: [ 
                        {username: { [Op.like]:userData.username}},
                        {email: {[Op.like]:userData.email}}
                    ]
                }
            });

            if (existingUser) {
                res.status(409).json({ message: 'User already exist' });
            } else {
                const salt = await bcryptjs.genSalt(10);
                const secPass = await bcryptjs.hash(userData.password, salt);

                await User.create({
                    ...userData,
                    password: secPass
                });

                res.status(200).json({ message: "User created successfully" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    })


router.post('/login', async (req, res) => {
    console.log(req.body);

    try {
        const user = await User.findOne({ where: { username: req.body.username } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passMatch = await bcryptjs.compare(req.body.password, user.password);

        const data = {
            user: {
                username: user.username
            }
        }

        const token = jwt.sign(data, 'secret@123', { expiresIn: 12 * 60 * 60 });

        res.send({ token: token, sessionExpire: Date.now() + (12 * 60 * 60 * 1000) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error login user' });
    }

})

router.put('/update/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            const secPass = await bcryptjs.hash(req.body.user.password, salt);
            req.body.user.password = secPass;
        }
        else {
            req.body.password = user.password;
        }
        await user.update(req.body.user);

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
})

router.post('/forget-password', async (req, res) => {
    try {
        
    } catch (error) {
        
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
})

module.exports = router;