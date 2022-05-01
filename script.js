console.log ("script.js loaded");

function getYear() {
  var time = new Date();
  var year = time.getFullYear();
  document.getElementById("year").innerHTML = year;
}

function exportZip() {
  var zip = new JSZip();
  
  // Add files in data/
  let maincss = fetchFile('data/main.css');
  zip.file("main.css", maincss, {binary: true});      
  let indexhtml = fetchFile('data/index.html');
  zip.file("index.html", indexhtml, {binary: true});

  // Add files in data/js/
  let js = zip.folder("js");
  let esmoduleshimsjs = fetchFile('data/js/es-module-shims.js');
  js.file("es-module-shims.js", esmoduleshimsjs, {binary: true});
  let threemodulejs = fetchFile('data/js/three.module.js');
  js.file("three.module.js", threemodulejs, {binary: true});
  
  // Add files in data/js/controls
  let jsControls = zip.folder("js/controls");
  let orbitcontrolsjs = fetchFile('data/js/controls/OrbitControls.js');
  jsControls.file("OrbitControls.js", orbitcontrolsjs, {binary: true});

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
