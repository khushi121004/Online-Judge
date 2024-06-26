const {exec} = require("child_process");
const path = require("path");
/*const fs = require("fs");

const outputPython = path.join(output,'pyOutputs');
if(!fs.existsSync(outputPython)){
    fs.mkdirSync(output,{recurisve:true});
}*/

module.exports.executePython = (filePath,inputFilePath) => {
    //const filename = path.basename(filePath);
    return new Promise((resolve,reject) => {
     exec(
        `python "${filePath}" < "${inputFilePath}"`,
        (error,stdout,stderr)=> {
            if (error){
                reject(error);
            }
            if(stderr){
                reject(stderr);
            }
            resolve(stdout);
        }
     );
    });
};