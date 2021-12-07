
const express = require('express');
const bcrypt = require('bcryptjs')
const router = new express.Router()
const User = require('../models/UserModels.js')
const auth = require('../middleware/auth.js');
const { rawListeners } = require('commander');



// Create a new user
//  public
router.post('/user/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    } catch (error) {
        res.status(400).send(error)
    }
})

// GET/login
// public
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findByIdCredential(email, password)
        const token = await user.generateAuthToken()

        res.status(200).send({ user, token })

    } catch (error) {
        res.status(404).send()
    }
})


// GET/me
// private
router.get('/user/:id', async (req, res) => {
        try {
            const user = await User.findById(req.params.id)

            if (!user)
                return res.status(404).send({error: "User not found"})

            res.status(302).send(user)

        } catch (error) {
            res.status(500).send(error)
        }
    }
)

// // Delete/user/:id
// // private
// router.delete('/user/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         user.remove()
//         res.status(302).send(user)
//     } catch (error) {
//         res.status(404).send(error)
//     }
// })


// Endpoint for the user logout
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})


// get/users        developer
// private
router.get('/user', auth, async (req, res) => {
    res.send(req.user)
})


// post/users   user
// update the user information
router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'age', 'email', 'gender', 'instagram', 'facebook']
    const isValidOpretion = updates.every(update => allowUpdates.includes(update))

    if(!isValidOpretion)
        return res.status(400).send({error: 'Invalid updates!'})

    try {
        updates.forEach(e => req.user[e] = req.body[e])
        await req.user.save()
        res.status(302).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Update Password
router.patch('/user/me/password', auth, async (req, res) => {
    const {password, newPassword} = req.body

    try {
        const isMatch = await bcrypt.compare(password, req.user.password)

        if(!isMatch){
            return res.status(400).send({error: 'Invalid password!'})
        }

        req.user.password = newPassword
        await req.user.save()

        res.status(200).send(req.user)
        // await req.user.save()
        // res.status(302).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})


// POST/user/logoutAll  
// It will delete all the tokens
router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// DELETE/user/me
// delete the user
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(302).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


// For admin
router.get('/users', auth, async(req, res) => {
    try {
        if(req.user.isAdmin === false)
            throw new Error({error: "Invalid request"})

        const users = await User.find({})
        res.status(201).send(users)
    } catch (error) {
        res.status(400).send({error: "Invalid request"})
    }
})

// make any user to admin
router.patch('/users/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        if(req.user.isAdmin === false)
            throw new Error({error: "Invalid request"})

        let user = await User.findById(_id)
        user.isAdmin = !user.isAdmin
        await user.save()

        res.status(201).send(user)
    } catch (error) {
        res.status(400).send({error: "Invalid request"})
    }
})

// Only by Admin
// Update user profile 
router.patch('/update/user/:id', auth, async (req, res) => {

    if(req.user.isAdmin){
        const updates = Object.keys(req.body)
        const allowUpdates = ['name', 'age', 'password', 'email', 'gender', 'instagram', 'facebook']
        const isValidOpretion = updates.every(update => allowUpdates.includes(update))

        if(!isValidOpretion)
            return res.status(400).send({error: 'Invalid updates!'})

        try {
            // updates.forEach(e => req.user[e] = req.body[e])
            // await req.user.save()
            // await bcrypt.hash(user.password, 8)

            if(req.body.password !== undefined){
                req.body.password = await bcrypt.hash(req.body.password, 8)
            }


            const user = await User.updateOne({_id: req.params.id}, {...req.body})

            res.status(302).send(user)
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }else{
        res.status(400).send({error: "You are not allowed to do so!"})
    }

})

module.exports = router