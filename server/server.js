const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
.then(() => console.log("DB CONNECTED"))
.catch(err => console.log("DB CONNECTION ERROR", err));



app.use(morgan("dev"));
app.use(bodyParser.json({limit: "2mb"}));
app.use(cors());



//routes middleware
readdirSync("./routes").map((r) => app.use("/api",  require("./routes/" + r)));


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
  
    app.get('/', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    )
  } 
const port = process.env.PORT || 8000;

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})