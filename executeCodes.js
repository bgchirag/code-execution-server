const os = require("os");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { deleteFile } = require("./deleteFile");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

const compileAndRunCpp = async (filePath, inputPath, jobId) => {
  const isWindows = os.platform() === "win32";

  const executablePath = isWindows
    ? path.join(outputPath, `${jobId}.exe`)
    : path.join(outputPath, `${jobId}`);

  const compileCommand = `g++ ${filePath} -o ${executablePath}`;

  const runCommand = isWindows
    ? `cd ${outputPath} && .\\${jobId}.exe < ${inputPath}`
    : `cd ${outputPath} && ./${jobId} < ${inputPath}`;

  return new Promise((resolve, reject) => {
    exec(compileCommand, {timeout: 5000}, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        return reject({ error: compileError, stderr: compileStderr });
      }
      if (compileStderr) {
        return reject({ stderr: compileStderr });
      }

      exec(runCommand, (runError, stdout, stderr) => {
        deleteFile(executablePath);
        if (runError) {
          return reject({ error: runError, stderr });
        }
        if (stderr) {
          return reject({ stderr });
        }
        resolve(stdout);
      });
    });
  });
};

const executePython = async (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(`python3 ${filePath} < ${inputPath}`, {timeout: 5000}, (error, stdout, stderror) => {
      if (error) {
        reject({ error, stderror });
      }
      if (stderror) {
        return reject({ stderr: stderror });
      }
      resolve(stdout);
    });
  });
};

const executeJavaScript = async (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filePath} < ${inputPath}`, {timeout: 5000}, (error, stdout, stderror) => {
      if (error) {
        reject({ error, stderror });
      }
     if (stderror) {
       return reject({ stderr: stderror });
     }

      resolve(stdout);
    });
  });
};

module.exports = {
  compileAndRunCpp,
  executePython,
  executeJavaScript,
};
