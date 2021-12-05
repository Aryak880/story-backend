require('./db/mongoose.js')
const cors = require('cors')
require('dotenv').config()
const express = require('express')
const storyRoute = require('./routers/storyRoute.js')
const userRoute = require('./routers/userRoute.js')
const app = express()
const PORT = process.env.PORT || 3005

app.use(cors())
app.use(express.json())
app.use(storyRoute)
app.use(userRoute)



app.listen(PORT, () => console.log(`Server is runnig on port: ${PORT}`))