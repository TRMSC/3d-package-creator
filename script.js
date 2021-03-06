/* 3D Package-Creator - Copyright (C) 2022, TRMSC - https://trmsc1.wordpress.com/ */
/* Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php */

console.log ("script.js loaded");

function getYear() {
  var time = new Date();
  var year = time.getFullYear();
  document.getElementById("year").innerHTML = year;
  return;
}

var origin = false;
var upload = false;
var fileUpload;

function printDetails(file) {
  var extension = file.name.split('.').pop();      
  if (extension == "zip") {
    traverseZip(file);
    return;
  }      
  var filetype;
  if (file.type == "") { filetype = extension; } 
  else { filetype = file.type; }
  var filesize = file.size/1000;
  filesize = Math.round(filesize);
  var fileitem = '<li class="listItem"><strong>'+ decodeURIComponent(file.name)+ '</strong> ('+ filetype + ') - '+
            filesize+ ' kb ' + '</li>';
  document.getElementById('list').innerHTML += fileitem;
  return extension;
}

function openFile(fileUpload) {
  //fileUpload = this.files[0];
  document.getElementById('list').innerHTML="";
  document.getElementById('note').innerHTML="";
  document.getElementById("loadingcontainer").style.zIndex = "999";
  document.getElementById("loadingcontainer").style.opacity = "1";
  uploadGlb = document.getElementById("upload").files[0];
  console.log (uploadGlb.size);
  console.log (uploadGlb.name.split('.').pop());
  printDetails (uploadGlb);
  origin = true;
  upload = true;
  //fileUpload = document.getElementById("upload").files[0];
  console.log ("file is uploaded");
  handleContentUpload(fileUpload);
  return;
}

function openGlb(fileUpload) {
  uploadGlb = fileUpload;
  origin = true;
  upload = true;
  console.log ("file is uploaded");
  handleModelUpload(fileUpload);
  return;
}

function clickDropzone() {
  document.getElementById("upload").click();
}

function makeFeedback(n) {
  document.getElementById("note").innerHTML=n;
  return;
}

function activateDownload() {
  document.getElementById("result").style.display = "flex";
  document.getElementById("feedback").style.display = "initial";
  document.getElementById("download").classList.add("checked");
  //document.getElementById("filecheck").classList.add("checked");
  document.getElementById("content-error").style.display = "none";
  return;
}

function exportZip() {
  if (upload == false) {
    alert ("Keine Modelldatei ausgew??hlt...");
    return false;
  }

  var zip = new JSZip();
  //var file;
  var folder;

  // Add upload
  if (origin == true) {
    //file = document.getElementById("upload").files[0];
    //console.log (file);
    //file = fileUpload;
    console.log (uploadGlb);
    zip.file("model.glb", uploadGlb, {binary: true});
  }

  // Add converted file
  if (origin == false) {
    file = new Blob([finalBuffer],{type: 'model/json-binary'});
    console.log ("blob is " + file);
    zip.file("model.glb", file, {binary: true});
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
