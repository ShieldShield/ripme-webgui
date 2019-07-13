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
const executer = new Executer(0, 0, 0,filename);

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
    comBuilder.printArgs();
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
        message: "good"
    });
})

app.get("/api/test/", (req, res) => {
    let response=false;
    response=JSON.stringify(response);
    res.send({
        message: `${response}`
    });
});

//testRead
var settings = {
    ordner: "test",
    saveorder: false,
    skip: false,
    prop: false,
    rerip: false,
    act: "weekly",
    hour: 5,
    minute: 4
}

app.get("/api/settings/read", (req, res) => {
    res.send(settings);
}) 

app.get("/api/settings/write/:json", (req, res) => {
    this.settings=req.params.json;
    res.send(settings);
}) 



app.listen(process.env.PORT || 8081);
