module.exports = this.Command = class Command {
    prefix="";
    options = [];

    constructor(prefix) {
        if (prefix !== null) {
            this.prefix = prefix;
        }
    }

    addOption(argument, content) {
        this.options.push(buildArgString(argument,content));
    }
    
    removeOption(argument, content) {
        const arg = buildArgString(argument, content);
        console.log("removing Argument...");
        let cnt = 0;
        let entf = false;
        for (let i = 0; i < this.options.length; i++) {
            console.log(`iritation ${i}`);
            if (this.options[i] === (arg)) {
                //Array Optionen
                this.options.splice(i, 1);
                //Leere einträge filtern
                this.cleanUp();
                //Damit nächster Eintrag nicht übersprungen wird
                i--;
                //Counter wie viel entfernt wurde
                cnt++;
                console.log(`content of cnt: ${cnt}`);
                console.log(`removed "${arg}" from Arguments`);
                entf = true;
            }
        }
        return entf;
    }

    build(URL) {
        return `${this.prefix} -u ${URL} ${this.options.join(" ")}`
    }

    cleanUp() {
        this.options = this.options.filter(Boolean);
    }

    printArgs() {
        console.log(this.options.toString());
    }

    getPrefix() {
        return this.prefix;
    }

    setPrefix(prefix) {
        this.prefix=prefix;
    }

    resetOptions() {
        this.options=[];
    }
}

function buildArgString(argument, content) {
    return `-${argument} ${content}`;
}
