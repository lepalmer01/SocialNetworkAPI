const express = require('express')
const db = require ('./config/connection.js')
const routes = require ('./routes')
const PORT = process.env.PORT || 3001;
const app = express()


// Express middleware - "use pulls in different express methods like urlencoded or json"
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(routes)


db.once("open", () => {
    app.listen(PORT, () => {
        console.log(`api listening on port ${PORT}`)
    })
})

