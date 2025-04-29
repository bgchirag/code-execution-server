const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");
const dirInputs = path.join(__dirname, "inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (language, code, fileId) => {
  const filename = `${fileId}.${language}`;
  const filePath = path.join(dirCodes, filename);
  await fs.writeFileSync(filePath, code);
  return filePath;
};

const generateInputFile = async (input, fileId) => {
  const filename = `${fileId}.txt`;
  const filePath = path.join(dirInputs, filename);
  await fs.writeFileSync(filePath, input);
  return filePath;
};

module.exports = {
  generateFile, generateInputFile
};
