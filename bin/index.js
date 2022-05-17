#!/usr/bin/env node
const path = require("path");
const open = require("open");
const { listAllImages } = require("./list-all-images");
const express = require("express");
const { getRandomPort, readFileAsString } = require("./utils");
const app = express();
const port = getRandomPort();

try {
  (async () => {
    const lastArgv = process.argv[process.argv.length - 1];
    const hasLastArgv = !lastArgv.endsWith("index.js");
    let realPreviewPath = hasLastArgv ? lastArgv : process.cwd();
    const files = await listAllImages(realPreviewPath);
    const sortedFiles = files
      .sort((a, b) => a.size - b.size)
      .map((item, index) => ({ ...item, src: index }));
    app.get("/", (req, res) => {
      res.send(`
        <html lang="zh">
          <head>
            <style>${readFileAsString(
              path.join(__dirname, "assets", "style.css")
            )}</style>
            <title>${realPreviewPath}</title>
          </head>
          <body><div id="container"></div></body>
          <script type="module">                           
            ${readFileAsString(path.join(__dirname, "assets", "javascript.js"))}
            const element = document.querySelector('#container');
            const photoGrid = new PhotoGridBox(element, ${JSON.stringify(
              sortedFiles
            )}, (e, item)=>{
              console.log(item);
              open(item.src);
            },()=>'caowei', 20, 20);          
          </script>
        </html>
      `);
    });

    sortedFiles.forEach((file, index) => {
      app.get(`/${index}`, (req, res) => {
        res.sendFile(file.filePath);
      });
    });
    app.listen(port);
    open(`http://localhost:${port}`);
  })();
} catch (e) {
  console.log(e);
}
