const express = require('express');
const auth = require('../middleware/auth.js')
const router = new express.Router()
const Story = require('../models/StoryModels.js')


// Create a new story
router.post('/me/story', auth, async(req, res) => {
    const story = new Story({
        ...req.body,
        owner: req.user._id
    })

    try {
        await story.save()
        res.status(201).send(story)

    } catch (error) {
        res.status(400).send({error})
    }
})


// Fetch all the stories of a writer
// GET /stories
    router.get('/me/stories', auth, async (req, res) => {
        try {
            // const match = {}
            
            await req.user.populate({
                path: 'stories'
            }).execPopulate()

            res.status(200).send(req.user.stories)
        } catch (error) {
            res.status(404).send(e)
        }
    })



// GET/stories
// It will fetch all the stories in database
    router.get('/stories', async (req, res) => {
        try {
            const stories = await Story.find({})
            res.status(200).send(stories)
        } catch (e) {
            res.status(404).send(e)
        }
    })

// DELETE/story/:id
// It will delete story
    router.delete('/me/story/:id', auth, async (req, res) => {
        try {
            const story = await Story.findByIdAndDelete(req.params.id)
            res.status(200).send(story)
        } catch (error) {
            res.status(400).send({error})
        }
    })


// PATCH/me/story/:id
// It will update the user story
    router.patch('/me/story/:id', auth, async (req, res) => {
        try {
            const updates = Object.keys(req.body) 
            const allowUpdates = ['likes', 'disLikes', 'title', 'story', 'category', 'comments']
            const isValidOperation = updates.every(update => allowUpdates.includes(update))
            
            if(!isValidOperation)
                return res.status(400).send({error: "Invalid Operation"})

                const story = await Story.updateOne({_id: req.params.id}, { ...req.body })
        
            res.status(200).send(story)

        } catch (error) {
            res.status(400).send({error: "Not Updated!"})
        }
    })

// PATCH/me/story/:id
// It will update the story likes and dislikes
    // router.patch('/story/likes-dislikes/:id', auth,async (req, res) => {
    //     try {
    //         const updates = Object.keys(req.body) 
    //         const allowUpdates = ['likes', 'disLikes']
    //         const isValidOperation = updates.every(update => allowUpdates.includes(update))
            
    //         if(!isValidOperation)
    //             return res.status(400).send({error: "Invalid Operation"})

    //             const story = await Story.updateOne({_id: req.params.id}, { ...req.body })
        
    //         res.status(200).send(story)

    //     } catch (error) {
    //         res.status(400).send({error: "Not Updated!"})
    //     }
    // })


// GET/read-story/:id
    router.get('/read-story/:id', async(req, res) => {
        try {
            const story = await Story.findById(req.params.id)

            res.status(200).send(story)
        } catch (e) {
            res.status(404).send({error: "Story is not found!"})
        }
    })



// test
    // router.patch('/me/story/:id', auth, async (req, res) => {
    //     try {
    //         const updates = Object.keys(req.body) 
    //         const allowUpdates = ['likes', 'disLikes', 'title', 'story', 'category', 'comments']
    //         const isValidOperation = updates.every(update => allowUpdates.includes(update))
            
    //         if(!isValidOperation)
    //             return res.status(400).send({error: "Invalid Operation"})

    //             const story = await Story.updateOne({_id: req.params.id}, { ...req.body })
        
    //         res.status(200).send(story)

    //     } catch (error) {
    //         res.status(400).send({error: "Not Updated!"})
    //     }
    // })


module.exports = router