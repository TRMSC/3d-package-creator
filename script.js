console.log ("script.js loaded");

function getYear() {
  var time = new Date();
  var year = time.getFullYear();
  document.getElementById("year").innerHTML = year;
}

function exportZip() {
  var zip = new JSZip();
  var file;
  var folder;
  
  // Add files in data/
  file = fetchFile('data/main.css');
  zip.file("main.css", file, {binary: true});      
  file = fetchFile('data/index.html');
  zip.file("index.html", file, {binary: true});

  // Add files in data/js/
  folder = zip.folder("js");
  file = fetchFile('data/js/es-module-shims.js');
  folder.file("es-module-shims.js", file, {binary: true});
  file = fetchFile('data/js/three.module.js');
  folder.file("three.module.js", file, {binary: true});
  
  // Add files in data/js/controls
  folder = zip.folder("js/controls");
  file = fetchFile('data/js/controls/OrbitControls.js');
  folder.file("OrbitControls.js", file, {binary: true});

  // Add files in data/js/environments
  folder = zip.folder("js/environments");
  file = fetchFile('data/js/environments/RoomEnvironment.js');
  folder.file("RoomEnvironment.js", file, {binary: true});

  // Create zip file
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
