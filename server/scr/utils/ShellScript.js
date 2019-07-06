const fs = require('fs');
const CommandBuilder=require('./CommandBuilder');
let executiveFileName = "message.txt";
const shebang = "#!/bin/bash";


module.exports = this.Script = class Script {
    //Konstruktor
    contArr = ["müll"];
    commandBuilder=new CommandBuilder();

    //Konstruktor
    constructor(filename, commandBuilder) {
        console.log("Object created");
        executiveFileName = filename;
        this.commandBuilder=commandBuilder;
    }

    //Datei überschreiben
    writeFile()  {
        console.log("Writing file");
        fs.writeFileSync(executiveFileName, "", "utf8");
        this.appendToFile(this.contArr[0]);
        for (let i = 1; i < this.contArr.length; i++) {
            this.appendToFile(this.contArr[i]);
        }
    }

    //Datei einlesen in [contArr]
    readFile = () => {
        console.log("reading file...");
        this.contArr = fs.readFileSync(executiveFileName, "utf8").toString().split("\n");
        for (let i = 0; i < this.contArr.length; i++) {
            console.log(`contArr: ${this.contArr[i]}`);
        }
        return this.contArr;
    }

    //Zeile hinten einfügen bei der Datei
    appendToFile = (append) => {
        fs.appendFile(executiveFileName, `${append}\n`, function (err) {
            errorHandling(err, Script.appendToFile);
            console.log("appended command");
        });
    }

    //Entfernt [content] Zeilen von der Textdatei
    removeFromFile = (content) => {
        console.log("removing line...");
        let cnt = 0;
        this.readFile();
        for (let i = 0; i < this.contArr.length; i++) {
            console.log(`iritation ${i}`);
            if (this.contArr[i].includes(content)) {
                //Array Optionen
                this.contArr.splice(i, 1);
                //Leere einträge filtern
                this.cleanUpFile();
                //Damit nächster Eintrag nicht übersprungen wird
                i--;
                //Counter wie viel entfernt wurde
                cnt++;
                console.log(`content of cnt: ${cnt}`);
                console.log(`removed "${content}" from file`);
            }
        }
        if (cnt !== 0) {
            this.writeFile();
        }
    }

    //Filtert leere Einträge in der Datei
    cleanUpFile() {
        this.contArr = this.contArr.filter(Boolean);
    }

    //Fügt commandBuilder command hinzu
    addCommand(url) {
        let exists = false;
        this.readFile();
        if (is_url(url)) {
            for (let i = 0; i < this.contArr.length; i++) {
                if (this.contArr[i].includes(url)) {
                    exists = true;
                    console.log("URL already exists");
                    break;
                }
            }
            if (!exists) {
                console.log("writing url...");
                this.commandBuilder.printArgs();
                this.appendToFile(this.commandBuilder.build(url));
            }
        } else {
            console.log("isn't a url");
        }
        return exists;
    }

    //entfernt command
    removeCommand(url) {
        try {
            this.removeFromFile(url);
            return true;
        } catch (err) {
            return false;
        }

    }

    //Fügt Hashbang an Anfang der Datei ein
    addSheBang() {
        //initialisierung
        this.readFile();
        //Überprüfen ob es schon shebang gibt
        if (!this.contArr[0].includes(shebang)) {
            //Schreiben
            const data = fs.readFileSync(executiveFileName);
            const fd = fs.openSync(executiveFileName, 'w+');
            const insert = shebang + "\n";
            fs.writeSync(fd, insert, 0, insert.length, 0);
            fs.writeSync(fd, data, 0, data.length, insert.length);
            fs.close(fd, (err) => {
                if (err) throw err;
            });
        }
    }

    getSheBang() {
        return shebang;
    }
}

function errorHandling(err, callback) {
    //Errorhandling
    let cnt = 0;
    let max = 5;
    //Probiere [max] mal die Datei zu schreiben
    if (err) {
        console.log(`error in ${callback} : ${err} \n trying again now...`);
        //Fehler, wenn es bei max ist
        if (cnt >= max) {
            console.log("No more retries left:", err);
            throw (err);
        }

        callback();
        cnt++;
    }
}

//testet, ob String eine URL ist
function is_url(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

