const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

const compileAndRunCpp = async (filePath, inputPath, jobId) => {
  const executablePath = path.join(outputPath, `${jobId}.exe`);

  const compileCommand = `g++ ${filePath} -o ${executablePath}`;

  const runCommand = `cd ${outputPath} && .\\${jobId}.exe < ${inputPath}`;

  return new Promise((resolve, reject) => {
    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        return reject({ error: compileError, stderr: compileStderr });
      }
      if (compileStderr) {
        return reject({ stderr: compileStderr });
      }

      exec(runCommand, (runError, stdout, stderr) => {
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
    exec(`python3 ${filePath} < ${inputPath}`, (error, stdout, stderror) => {
      if (error) {
        reject({ error, stderror });
      }
      if (stderror) {
        reject(stderror);
      }
      resolve(stdout);
    });
  });
};

const executeJavaScript = async (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filePath} < ${inputPath}`, (error, stdout, stderror) => {
      if (error) {
        reject({ error, stderror });
      }
      if (stderror) {
        reject(stderror);
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
