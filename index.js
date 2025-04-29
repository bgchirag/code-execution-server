const express = require("express");
const bodyParser = require("body-parser");
const { compileAndRunCpp, executePython, executeJavaScript } = require("./executeCodes");
const uuid = require("uuid");
const { generateFile, generateInputFile } = require("./generateFile");
const { deleteFile } = require("./deleteFile");

const app = express();
const port = 3001;

app.use(bodyParser.json());
const router = express.Router();
app.use("/api", router);

router.post("/run", async (req, res) => {
  const { lang = "cpp", code, input } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  const jobId = uuid.v4();
  const filePath = await generateFile(lang, code, jobId);
  const inputPath = await generateInputFile(input, jobId);

  try {
    let output;

    if (lang === "cpp") {
      output = await compileAndRunCpp(filePath, inputPath, );jobId
    } else if (lang === "python") {
      output = await executePython(filePath, inputPath);
    } else if (lang === "javascript") {
      output = await executeJavaScript(filePath, inputPath);
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Unsupported language!" });
    }

    deleteFile(filePath);
    deleteFile(inputPath);
    console.log(`Output: ${output}`);
    
    res.status(200).json({ output });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Code execution server running on port ${port}`);
});
