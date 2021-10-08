//gaining access to the process object so we can use the argv and exit
//methods
const { argv, exit } = require("process");
//gaining assess to the file system api
const { readFile, writeFile } = require('fs/promises');


//creating an error message that is envoked when the user doesn't use a subcommand
//tells the user the four options they have as subcommands and 
//tells the user how to handle the four subcommand options
async function main() {
    const command = argv[2];
    const index = argv[3];
    let age = Number(argv[3]);
    let kind = argv[4];
    let name = argv[5];
    const string = await readFile("./pets.json", "utf8");
    const data = JSON.parse(string);
    switch (command) {
    case "read":
        if (index < 0 || index >= data.length) {
            console.error("Usage: node pets.js read INDEX")
            exit(1);
        } else if (index === undefined) {
            console.log(data);
        } else {
            console.log(data[index]);
        }
        break;
    case "create":
        if (age && kind && name) {
            const newPet = {
                age: age, 
                kind: kind, 
                name: name
            };
            data.push(newPet);
            await writeFile("./pets.json", JSON.stringify(data));
        } else {
            console.error('Usage: node pets.js create AGE KIND NAME');
            exit(1);
        }
        break;
    case "update":
        console.log('accessed update');
        break;
    case "destroy":
        console.log('accessed destroy');
        break;
    default:
        console.error("Usage: node pets.js [read | create | update | destroy]");
        exit(1);
    }
}

main();

//exits the process with a non-zero exit code
//exit(1);

