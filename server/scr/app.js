//NPM Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app=express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());



app.get("/api/:id", (req, res) => {
    let url=decodeURIComponent(req.params.id);
    res.send({
        message: `Hello ${url}! Your user was registered! Have fun!`
    });
});


app.listen(process.env.PORT || 8081);
