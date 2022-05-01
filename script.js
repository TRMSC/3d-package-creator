console.log ("script.js loaded");

function getYear() {
  var time = new Date();
  var year = time.getFullYear();
  document.getElementById("year").innerHTML = year;
}

function exportZip() {
  var zip = new JSZip();
        
  let maincss = fetchFile('data/main.css');
  zip.file("smile.css", maincss, {binary: true});
        
  let indexhtml = fetchFile('data/index.html');
  zip.file("index.html", indexhtml, {binary: true});
        
  zip.generateAsync({type:"blob"})
  .then(function(content) {
    // see FileSaver.js
    saveAs(content, "3d-package.zip");
  });
}

function fetchFile(path) {
  let x = fetch(path)
    .then(response => response.text());
  return x;
}
