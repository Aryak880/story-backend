const User = require('../models/UserModels.js')
const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user)
            throw new Error()

        req.token = token
        req.user = user

        next()

    } catch (e) {
        res.status(404).send({error: 'Authenticate please'})
    }
}

module.exports = auth