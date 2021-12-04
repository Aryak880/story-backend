const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://aryak1234:aryak1234@cluster0.jole8.mongodb.net/story?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false 
})

