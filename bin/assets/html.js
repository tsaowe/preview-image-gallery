exports.html = (css, script) =>{
  return `<html lang="zh">
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
            const photoGrid = new PhotoGridBox(element, ${JSON.stringify(
    sortedFiles
  )}, (e, item)=>{
              console.log(item);
            },()=>'<div><button>open in new tab</button><button>copy info</button></div>', 20, 20);          
          </script>
        </html>`
}
