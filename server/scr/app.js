//NPM Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const ShellScript = require('./utils/ShellScript');
const CommandBuilder = require('./utils/CommandBuilder');

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

const prefix = "java -jar ./ripme.jar";
const comBuilder = new CommandBuilder(prefix);

const filename = __dirname + "/message.txt";
const shScript = new ShellScript(filename, comBuilder);

//CommandBuilder
app.get("/api/command/:mode/:argument/:content", (req, res) => {
    let mode = req.params.mode;
    let argument = req.params.argument;
    let content = req.params.content;
    console.log(mode, argument, content);
    if (mode === "add") {
        comBuilder.addOption(argument, content);
    } else if (mode === "rem") {
        comBuilder.removeOption(argument, content);
    } res.send({
        message: `good`
    });
    comBuilder.printArgs();
});

app.get("/api/command/:mode/:argument/", (req, res) => {
    let mode = req.params.mode;
    let argument = req.params.argument;
    if (mode === "add") {
        comBuilder.addOption(argument);
    } else if (mode === "rem") {
        comBuilder.removeOption(argument);
    } res.send({
        message: `good`
    });
});

//Shellscript
app.get("/api/shell/:mode/:url", (req, res) => {
    let url = req.params.url;
    console.log(url);
    let mode = req.params.mode;
    if (mode === "add") {
        shScript.addCommand(url);
    } else if (mode === "rem") {
        shScript.removeCommand(url);
    } res.send({
        message: `good`
    });
});


//response
app.get("/api/shell/read", (req, res) => {
    let response = shScript.readFile();
    if (response[0].includes(shScript.getSheBang())) {
        response.shift();
    }
    res.send(response);
});


//test
app.get("/api/:id", (req, res) => {
    res.send({
        message: `Hello ${req.params.id}! This is a test message!`
    });
});


app.listen(process.env.PORT || 8081);
