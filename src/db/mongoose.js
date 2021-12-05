const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI , {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false 
})

// "mongodb+srv://aryak1234:aryak1234@cluster0.jole8.mongodb.net/story?retryWrites=true&w=majority"

