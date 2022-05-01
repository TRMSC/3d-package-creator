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

  // Add files in data/js/libs
  folder = zip.folder("js/libs");
  file = fetchFile('data/js/libs/meshopt_decoder.module.js');
  folder.file("meshopt_decoder.module.js", file, {binary: true});

  // Add files in data/js/libs/basis
  folder = zip.folder("js/libs/basis");
  file = fetchFile('data/js/libs/basis/README.md');
  folder.file("README.md", file, {binary: true});
  file = fetchFile('data/js/libs/basis/basis_transcoder.js');
  folder.file("basis_transcoder.js", file, {binary: true});
  file = fetchFile('data/js/libs/basis/basis_transcoder.wasm');
  folder.file("basis_transcoder.wasm", file, {binary: true});

  // Add files in data/js/loaders
  folder = zip.folder("js/loaders");
  file = fetchFile('data/js/loaders/GLTFLoader.js');
  folder.file("GLTFLoader.js", file, {binary: true});
  file = fetchFile('data/js/loaders/KTX2Loader.js');
  folder.file("KTX2Loader.js", file, {binary: true});

  // Add files in data/js/utils
  folder = zip.folder("js/utils");
  file = fetchFile('data/js/utils/WorkerPool.js');
  folder.file("WorkerPool.js", file, {binary: true});

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
