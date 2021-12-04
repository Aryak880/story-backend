const mongoose = require("mongoose")
const validator = require('validator')

const StorySchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    story: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            unique: true
        }   
    ],
    disLikes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                unique: true
            }    
    ],
    category: {
        type: String,
        require: true,
        trim: true
    },
    comments: [
        {
            name: {
                type: String,
                trim: true,
            },
            comment: {
                type: String,
                trim: true
            }
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Story = mongoose.model('Story', StorySchema)

module.exports = Story