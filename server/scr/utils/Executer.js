const { exec } = require('child_process');
var schedule= require('node-schedule');
var scheduled;

module.exports = this.executer = class executer {
    rule = new schedule.RecurrenceRule();
    weekDay=0;
    hour=0;
    minute=0;
    executiveFileName;

    constructor(weekDay,hour,minute, executiveFileName) {
        this.weekDay=weekDay;
        this.hour=hour;
        this.minute=minute;
        this.executiveFileName=executiveFileName;
    }

    //Getter und Setter
    setAll(weekDay,hour,minute) {
        this.weekDay=weekDay;
        this.hour=hour;
        this.minute=minute;
    }

    setWeek(weekDay) {
        this.weekDay=weekDay;
    }
    
    setHour(hour) {
        this.hour=hour;
    }

    setMinute(minute) {
        this.minute=minute;
    }

    getAll() {
        return {
            weekDay: this.weekDay,
            hour: this.hour,
            minute: this.minute
        }
    }

    updateRule() {
        this.failsafeCheck();
        this.rule.dayOfWeek=this.weekDay;
        this.rule.hour=this.hour;
        this.rule.minute=this.minute;
        scheduled=schedule.scheduleJob(this.rule, function() {
            this.execute();
        })
        
    }

    execute() {
        console.log(`executing... ${this.executiveFileName}`)
        exec(this.executiveFileName);
    }

    cancel() {
        scheduled.cancel();
    }

    failsafeCheck() {
        let reset = false;
        if(compliantTimeSev(this.weekDay)) {
            reset=true;
        } else if(compliantTimeTwo(this.hour)){
            reset=true;
        } else if(compliantTimeSix(this.minute)) {
            reset = true;
        }
        if(reset) {
            console.log("reseting time to prevent Servercrash");
            this.weekDay=0;
            this.hour=0;
            this.minute=0;
            this.updateRule();
        }
    }
}

function compliantTimeSix(cont) {
    if(cont>=60) {
        return false;
    } else {
        return true;
    }
}

function compliantTimeTwo(cont) {
    if(cont>=24) {
        return false;
    } else {
        return true;
    }
}

function compliantTimeSev(cont) {
    if(cont>=7)  {
        return false;
    } else {
        return true;
    }
}
