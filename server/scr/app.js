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

const prefix = `java -jar ${__dirname}/ripme.jar`;
const comBuilder = new CommandBuilder(prefix);

let filename;
let isWin = process.platform === "win32";
console.log("isWin=" + isWin);
let shScript;
if (isWin) {
    filename = __dirname + "/script/script.bat";
    shScript = new ShellScript(filename, comBuilder);
    shScript.addSheBangWin();
} else {
    filename = __dirname + "/script/script.sh";
    shScript = new ShellScript(filename, comBuilder);
    shScript.addSheBang();
}

const Executer = require("./utils/Executer");
const executer = new Executer(0, 0, 0, __dirname + "/script" + "/script.bat");

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
        console.log("removing...")
    } res.send({
        message: `good`
    });
});


//response
app.get("/api/shell/read", (req, res) => {
    function linkify(text) {
        let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.match(urlRegex)
    }
    let response = shScript.readFile();
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (response[0].includes(shScript.getSheBang())) {
        response.shift();
    }
    for (let i = 0; i < response.length; i++) {
        response[i] = linkify(response[i]);
    }
    response.filter(Boolean);
    res.send(response);
});

app.get("/api/exec/:url", (req, res) => {
    //TODO: implement API
    let url = req.params.url;
    res.send({
        message: `good`
    });
});

//Execute
app.get("/api/execute/:minute/:hour/:weekday", (req, res) => {
    let minute = req.params.minute;
    let hour = req.params.hour;
    let weekday = req.params.weekday;
    executer.setWeekly(weekday, hour, minute);
    executer.enforceRule();
    res.send({
        message: `good`
    });
});

app.get("/api/execute/:minute/:hour", (req, res) => {
    let minute = req.params.minute;
    let hour = req.params.hour;
    executer.setDaily(hour, minute);
    executer.enforceRuleDaily();
    res.send({
        message: `good`
    });
});

app.get("/api/execute/:url", (req, res) => {
    let url = req.params.url;
    let command = comBuilder.build(url);
    executer.executeOnce(command);
    res.send({
        message: `good`
    });
})


//test
app.get("/api/:id", (req, res) => {
    res.send({
        message: `Hello ${req.params.id}! This is a test message!`
    });
});


app.listen(process.env.PORT || 8081);
