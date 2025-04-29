const express = require("express");
const bodyParser = require("body-parser");
const { compileAndRunCpp, executePython, executeJavaScript } = require("./executeCodes");
const uuid = require("uuid");
const { generateFile, generateInputFile } = require("./generateFile");
const { deleteFile } = require("./deleteFile");
const { containsForbiddenPatterns } = require("./forbiddenPatterns");
const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    return res
      .status(429)
      .json({ success: false, error: "Too many requests, try again later." });
  },
});

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.json({ limit: "20kb" }));
app.use(limiter);
app.set("trust proxy", 1);

const router = express.Router();
app.use("/api", router);

router.get("/", (req, res) => {
  res.send("<h1>Code Execution</h1>");
});

router.post("/run", async (req, res) => {
  const { lang = "cpp", code, input } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  if(containsForbiddenPatterns(code, lang)) {
    return res.status(403).json({ success: false, error: "Code contains forbidden patterns!" });
  };


  const jobId = uuid.v4();
  const filePath = await generateFile(lang, code, jobId);
  const inputPath = await generateInputFile(input, jobId);

  try {
    let output;

    if (lang === "cpp") {
      output = await compileAndRunCpp(filePath, inputPath, jobId);
    } else if (lang === "python") {
      output = await executePython(filePath, inputPath);
    } else if (lang === "javascript") {
      output = await executeJavaScript(filePath, inputPath);
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Unsupported language!" });
    }

    console.log(`Output: ${output}`);
    
    res.status(200).json({ output });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ success: false, error: e.message });
  } finally {
    deleteFile(filePath);
    deleteFile(inputPath);
  }
});

app.listen(port, () => {
  console.log(`Code execution server running on port ${port}`);
});
