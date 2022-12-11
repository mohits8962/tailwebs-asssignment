const express = require('express')
const route = require('./routes/routes')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())

mongoose.connect("mongodb+srv://mohits8962:m26u72h8@teach-stu-assign-database.f1gfhiv.mongodb.net/tailwebs-assignment?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});