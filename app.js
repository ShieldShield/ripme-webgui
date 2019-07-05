//Imports
const Script = require('./utils/ShellScript');
const fs = require('fs');
const CommandBuilder = require("./utils/CommandBuilder");
const filename="./test/message.txt";
const prefix="java -jar ./ripme.jar";
const testUrl="https://www.youtube.com/watch?v=jN_Sb1U2PjM";

//Code


const cb=new CommandBuilder(prefix);
const sc=new Script(filename,cb);


cb.printArgs();
cb.addOption("u",testUrl);
cb.printArgs();
var command=cb.build();
sc.addSheBang();
sc.removeCommand(testUrl);


