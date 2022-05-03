/* 3D Package-Creator - Copyright (C) 2022, TRMSC - https://trmsc1.wordpress.com/ */
/* Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php */

console.log ("script.js loaded");

function getYear() {
  var time = new Date();
  var year = time.getFullYear();
  document.getElementById("year").innerHTML = year;
  return;
}

var upload = false;
function openFile(fileUpload) {
  file = document.getElementById("upload").files[0];
  console.log ("file is uploaded");
  handleContentUpload(fileUpload);
  origin = true;
  upload = true;
  return;
}

function exportZip(file, origin) {
  if (upload == false) {
    alert ("Keine Modelldatei ausgewählt...");
    return false;
  }

  var zip = new JSZip();
  //var file;
  var folder;

  // Add upload
  if (origin == true) {
    //file = document.getElementById("upload").files[0];
    zip.file("model.glb", file, {binary: true});
  }

  // Add converted file
  if (origin == false) {
    file = new Blob([finalBuffer],{type: 'model/json-binary'});
    console.log ("blob is " + file);
    //file2 = URL.createObjectURL(file);
    zip.file("model.glb", file, {binary: true});
    /*
  JSZipUtils.getBinaryContent(file2, function (err, data) {
    if(err) {
       throw err; // or handle the error
       console.log ("does not work... " + file);
    }
    zip.file("model2.glb", data, {binary:true});
  });
  */
}
  
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
  return;
}

function fetchFile(path) {
  let x = fetch(path)
    .then(response => response.text());
  return x;
}
