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
    const hasLastArgv = !lastArgv.endsWith("preview-image-gallery");
    let realPreviewPath = hasLastArgv ? lastArgv : process.env.PWD;
    const files = await listAllImages(realPreviewPath);
    const sortedFiles = files
      .sort((a, b) => a.size - b.size)
      .map((item, index) => ({ ...item, src: item.shortPath }));
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
            ${readFileAsString(path.join(__dirname, "assets", "javascript.js"))}
            const element = document.querySelector('#container');                                  
            const photoGrid = new PhotoGridBox(element, ${JSON.stringify(sortedFiles)}, (e, item)=>{             
              const classname = e.target.className;
              switch (classname) {
                case 'new':
                  open(item.src);
                  break;
                case 'copy':
                  navigator.clipboard.writeText(JSON.stringify(item, '', 2));
                  window.createNotification({
                    closeOnClick: false,
                    displayCloseButton: true,
                    positionClass: 'nfc-top-right',
                    showDuration: 5000,
                    theme: 'success',
                  })({
                    title: 'Copy Success',
                    message: JSON.stringify(item, '', 2),                   
                  });
                  break;
                default:
                  break;
              }
            },()=>'<div class="panel"><span class="new">open</span><span class="copy">copy</span></div>', 10, 10);          
          </script>
        </html>
      `);
    });
    sortedFiles.forEach((file, index) => {
      app.get(`${file.src}`, (req, res) => {
        res.sendFile(file.filePath);
      });
    });
    app.listen(port);
    open(`http://localhost:${port}`);
  })();
} catch (e) {
  console.log(e);
}
