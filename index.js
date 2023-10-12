const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var path = require('path');
var cors = require('cors')



let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./drive");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
});

const app = express();
app.use(cors())
app.use("/drive", express.static(path.join(__dirname, 'drive')));

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
    res.json({success: "true", message: "App is working fine"});
} )
app.post("/upload", upload.single("file"), function (req, res, next) {
  const baseUrl = `${req.protocol}://${req.hostname}`;
  res.json({ success: true, downloadLink: baseUrl +"/drive/" + req.file.filename });
});
const port = process.env.PORT || 8080;
app.listen(port);
