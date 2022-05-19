#!/usr/bin/env node
const path = require("path");
const os = require('os');
const open = require("open");
const { listAllImages } = require("./list-all-images");
const express = require("express");
const { getRandomPort, readFileAsString } = require("./utils");
const app = express();
const port = getRandomPort();

//  development mode
const isLocalMachine = os.userInfo().uid === 503 && os.userInfo().gid === 20;

try {
  (async () => {
    const lastArgv = process.argv[process.argv.length - 1];
    const hasLastArgv = !lastArgv.endsWith("preview-image-gallery");
    let realPreviewPath = hasLastArgv ? lastArgv : process.env.PWD;
    if(isLocalMachine){
      realPreviewPath = path.resolve('..', 'images');
    }

    const files = await listAllImages(realPreviewPath);
    const sortedFiles = files
      .sort((a, b) => a.size - b.size)
      .map((item) => ({ ...item, src: item.shortPath }));
    app.get("/", (req, res) => {
      const title = realPreviewPath.startsWith("/")
        ? realPreviewPath
        : path.resolve(realPreviewPath);
      res.send(`
        <html lang="zh">
          <head>
            <style>${readFileAsString(
              path.join(__dirname, "assets", "style.css")
            )}</style>
            <title>${title}</title>
          </head>
          <body><div id="container"></div></body>
          <script type="module">                           
            window.sortedFiles = ${JSON.stringify(sortedFiles)};
            ${readFileAsString(path.join(__dirname, "assets", "javascript.js"))}                
          </script>
        </html>
      `);
    });
    sortedFiles.forEach((item) => {
      app.get(`${item.src}`, (req, res) => {
        res.sendFile(item.filePath);
      });
    });
    app.listen(port);
    open(`http://localhost:${port}`);
  })();
} catch (e) {
  console.log(e);
}
